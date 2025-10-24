# Exam Generator

An intelligent exam generation application powered by AI, with Google OAuth authentication, chat-based interface, and internationalization support.

## what's this about?

This is a React app that helps you create custom exams using artificial intelligence. You log in with your Google account, pick a subject and exam type (first midterm, second midterm, or final), and the app generates a complete exam for you in a chat-like interface. All your generated exams are saved as threads in your browser, so you can revisit them anytime. It's bilingual (Spanish and English) and remembers your language preference.

## chat interface overview

The app now features a modern chat-based interface where:

- **User prompts** appear as chat messages: "Today I want to generate a [exam type] of [subject]"
- **AI responses** stream in real-time and render as formatted markdown
- **Thread history** is shown in a left sidebar for easy navigation
- **Each exam** is a separate thread that persists in your browser
- **New exams** can be created with the "New Exam" button

## how it works

### the authentication flow

1. **landing at login page**: when you first visit, you're greeted with a clean login interface
2. **google oauth magic**: click the button, authorize with Google, and AWS Cognito handles the secure authentication
3. **token juggling**: the app stores your authentication tokens and uses them for all API requests
4. **staying logged in**: refresh the page? no worries, you're still authenticated until you explicitly sign out

### the chat-based exam generation

Once you're in, here's what happens:

1. **thread sidebar**: on the left, you see all your previously generated exams as threads
2. **start new exam**: click "New Exam" to begin
3. **pick your exam type**: choose between first midterm, second midterm, or final exam
4. **select a subject**: choose from available subjects or enter a custom one
5. **watch it stream**: the AI generates the exam in real-time, appearing as a chat message
6. **switch threads**: click any thread in the sidebar to view past exams
7. **persistent storage**: all threads are saved in IndexedDB (browser storage)

## the tech stack

### frontend architecture

- **React 19.2.0**: using the latest features, strict mode, and functional components throughout
- **TypeScript 5.9.3**: strongly typed everything for better developer experience and fewer runtime errors
- **React Router 6**: handles navigation between login, exam generator, and auth info pages
- **Tailwind CSS 4**: utility-first styling with custom gradients and animations
- **react-markdown**: renders AI-generated exam content with markdown formatting
- **Dexie.js**: elegant IndexedDB wrapper for thread persistence
- **eventsource-parser**: handles SSE (Server-Sent Events) for real-time streaming

### authentication

- **AWS Amplify 6.15.7**: manages the entire OAuth flow
- **AWS Cognito**: backend identity provider
- **Google OAuth**: social login provider
- **JWT tokens**: ID token for identity, access token for API authorization

### internationalization

- **i18next 24.2.0**: core i18n framework
- **react-i18next 15.2.0**: React bindings
- **i18next-browser-languagedetector 8.1.0**: automatically detects user's preferred language from browser settings
- **language persistence**: your choice is saved in localStorage and restored on next visit

### API communication

- **axios**: for standard REST calls
- **fetch API with SSE**: for streaming responses (real-time exam generation)
- **interceptors**: automatically inject auth tokens into every request
- **error handling**: 401 responses automatically redirect to login

## architecture deep dive

### directory structure

```
src/
├── schemas/          # Zod schemas (PascalCase naming)
│   ├── exam.ts       # ExamTypeSchema, ExamRequestSchema, etc.
│   ├── thread.ts     # ThreadSchema, MessageSchema
│   ├── auth.ts       # AuthInfoSchema
│   └── user.ts       # UserAttributesSchema, ContextSchema
│
├── types/            # TypeScript types inferred from schemas
│   ├── exam.ts       # ExamType, ExamRequest, ExamResponse, etc.
│   ├── thread.ts     # Thread, Message
│   ├── auth.ts       # AuthInfo
│   └── user.ts       # UserAttributes, Context
│
├── services/         # Business logic and data access (modular!)
│   ├── IThreadStorage.ts           # Storage interface contract
│   ├── IndexedDBThreadStorage.ts   # Browser-based implementation
│   └── threadStorage.ts            # Factory/singleton pattern
│
├── hooks/            # Custom React hooks
│   ├── useThreads.ts     # Thread lifecycle management
│   ├── useLanguage.ts    # Language management hook
│   └── useSubjects.ts    # Subjects fetching hook
│
├── components/       # React components
│   ├── ExamGenerator.tsx       # Main orchestrator
│   ├── ThreadList.tsx          # Left sidebar with thread history
│   ├── ChatView.tsx            # Chat messages display area
│   ├── Message.tsx             # Individual message bubble
│   ├── MessageLoader.tsx       # Streaming indicator
│   ├── ExamTypeSelector.tsx    # Exam type picker
│   ├── SubjectInput.tsx        # Subject selection
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── LanguageSwitcher.tsx    # ES/EN toggle
│
├── api/              # API clients
│   ├── client.ts     # Axios + SSE client with auth interceptors
│   ├── exam.ts       # Exam generation endpoints
│   └── subjects.ts   # Subject list endpoint
│
├── context/
│   └── UserContext.tsx    # Global user state management
│
├── i18n/
│   ├── config.ts          # i18next configuration
│   └── locales/
│       ├── es.json        # Spanish translations
│       └── en.json        # English translations
│
├── pages/
│   ├── AuthPage.tsx       # Debug page (auth tokens/scopes)
│   ├── LogInPage.tsx      # Google OAuth login
│   └── PromptPage.tsx     # Main exam generator page
│
├── routes/
│   └── PrivateRoutes.tsx  # Protected route wrapper
│
└── constants/
    ├── api.ts             # API endpoints configuration
    └── config.ts          # App-wide constants
```

### data models

#### Thread

Represents a complete exam generation session:

```typescript
{
  id: string;                    // Unique identifier
  title: string;                 // Display title (e.g., "midterm1 - Operating Systems")
  subject: string;               // Subject name
  examType: ExamType;            // "midterm1", "midterm2", or "final"
  messages: Message[];           // Conversation history
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
}
```

#### Message

Individual messages in the chat:

```typescript
{
	id: string; // Unique identifier
	role: "user" | "assistant"; // Message sender
	content: string; // Message content (markdown for assistant)
	timestamp: number; // Timestamp
}
```

### storage strategy (highly modular!)

The storage layer is **completely abstracted** through the `IThreadStorage` interface:

```typescript
interface IThreadStorage {
	createThread(thread: Thread): Promise<void>;
	getThread(id: string): Promise<Thread | undefined>;
	getAllThreads(): Promise<Thread[]>;
	updateThread(thread: Thread): Promise<void>;
	deleteThread(id: string): Promise<void>;
}
```

**Current Implementation**: `IndexedDBThreadStorage`

- Uses Dexie.js for IndexedDB management
- All data stored in browser
- Persists across sessions
- Indexed on `createdAt` and `updatedAt` for performance

**Future Migration to API**:
To migrate to API-based storage, simply:

1. Create `APIThreadStorage.ts`:

```typescript
export class APIThreadStorage implements IThreadStorage {
	async createThread(thread: Thread): Promise<void> {
		await fetch("/api/threads", {
			method: "POST",
			body: JSON.stringify(thread),
			headers: { "Content-Type": "application/json" },
		});
	}
	// ... implement other methods
}
```

2. Update one line in `threadStorage.ts`:

```typescript
storageInstance = new APIThreadStorage(); // instead of IndexedDBThreadStorage
```

**That's it!** No other code needs to change thanks to the interface abstraction.

### component flow

1. **ExamGenerator** (Main Container)

   - Orchestrates thread creation and selection
   - Manages exam generation state
   - Renders ThreadList and ChatView

2. **ThreadList** (Left Sidebar)

   - Displays all threads sorted by last updated
   - "New Exam" button at top
   - Highlights currently selected thread
   - Shows thread titles and dates

3. **ChatView** (Main Content Area)

   - Shows all messages in selected thread
   - Auto-scrolls to latest message
   - Displays thread title and creation date
   - Shows loading indicator while streaming

4. **Message** (Individual Message Bubble)

   - User messages: right-aligned, blue gradient background
   - Assistant messages: left-aligned, markdown rendered, gray background
   - Timestamps for context

5. **MessageLoader** (Streaming Indicator)
   - Animated dots indicate AI is generating
   - Appears while waiting for response

### SSE streaming implementation

Uses `eventsource-parser` for robust SSE handling:

```typescript
await examApi.streamExam(request, {
	onToken: (token) => {
		// Real-time content accumulation
		accumulatedContent += token;
		updateThreadMessage(threadId, messageId, accumulatedContent);
	},
	onError: (error) => {
		// Handle streaming errors
		setError(error);
	},
	onRetry: (seconds) => {
		// Retry logic for network issues
		console.log(`Retrying in ${seconds} seconds...`);
	},
	onPause: (shouldContinue) => {
		// Handle pause events
		console.log(`Stream paused`);
	},
});
```

**SSE Events Handled**:

- `message_delta`: Streaming content chunks (main content)
- `message_delta_stop`: End of message signal
- `message_pause`: Pause notification
- `message_retry`: Retry notification with delay
- `message_failed` / `error`: Error handling

### state management with useThreads hook

The `useThreads` custom hook provides complete thread management:

```typescript
const {
	threads, // All threads array
	currentThread, // Selected thread
	isLoading, // Loading state
	createThread, // Create new thread
	addMessage, // Add message to thread
	updateThreadMessage, // Update message (for streaming)
	deleteThread, // Delete thread
	selectThread, // Switch to different thread
	setCurrentThread, // Manually set current thread
} = useThreads();
```

**Key operations**:

- Auto-loads all threads on mount
- Manages current thread selection
- Handles message CRUD operations
- Updates thread timestamps automatically
- Persists changes to storage immediately

### API payload structure

**Exam Generation** (POST /generate-exam-stream):

```json
{
	"subject": "operating_systems",
	"type": "midterm1" // or "midterm2" or "final"
}
```

Note: The old `midterm_number` field is no longer used. Types are now explicit.

**Subjects Endpoint** (GET /subjects):

```json
[
	{
		"subject": "operating_systems",
		"i18n": {
			"es": "Sistemas Operativos",
			"en": "Operating Systems"
		}
	}
]
```

## key features explained

### modular storage architecture

The storage layer follows SOLID principles:

- **Single Responsibility**: Each storage class handles one storage method
- **Open/Closed**: Easy to extend with new storage implementations
- **Liskov Substitution**: Any `IThreadStorage` implementation works
- **Interface Segregation**: Clean, minimal interface
- **Dependency Inversion**: Code depends on interface, not implementation

### zod schemas (PascalCase naming)

All validation schemas use PascalCase for consistency:

- `ExamTypeSchema`, `ExamRequestSchema`, `ExamResponseSchema`
- `ThreadSchema`, `MessageSchema`
- `AuthInfoSchema`, `UserAttributesSchema`

Types are inferred using `z.infer<typeof Schema>` and kept in separate `/types` directory.

### real-time streaming UX

The SSE implementation creates an engaging experience:

- Content appears character by character
- No waiting for complete response
- Feels like chatting with a real assistant
- Error handling without losing context

### persistent exam history

IndexedDB provides:

- Zero server dependency for storage
- Fast queries with indexes
- Works offline
- Unlimited storage (within browser limits)
- Automatic serialization

## running locally

1. **install dependencies**:

   ```bash
   npm install
   ```

2. **configure AWS Amplify**:
   Ensure `amplifyconfiguration.json` is in project root with Cognito and OAuth settings

3. **start development server**:

   ```bash
   npm start
   ```

4. **build for production**:
   ```bash
   npm run build
   ```

## environment setup

You'll need:

- AWS Cognito user pool configured
- Google OAuth app with authorized redirect URIs
- Backend API endpoint for exam generation
- (Optional) Backend API for subjects list

## code quality standards

- **PascalCase schemas**: All Zod schemas use PascalCase naming
- **Type inference**: Types inferred from schemas, not duplicated
- **No `any` types**: Everything properly typed
- **Modular architecture**: Easy to swap implementations
- **Interface-based design**: Depend on contracts, not implementations
- **Custom hooks**: Extracted reusable logic
- **Error boundaries**: Graceful error handling
- **Biome linting**: Consistent code style

## future enhancements

Easy to add thanks to modular architecture:

### storage

- ✅ IndexedDB (Current)
- 🔄 API-based storage (ready to implement)
- 🔄 Cloud sync across devices
- 🔄 Export/import threads

### features

- 🔄 Thread search and filtering
- 🔄 Thread tags/categories
- 🔄 Edit thread titles
- 🔄 Regenerate messages
- 🔄 Thread branching/forking
- 🔄 Export as PDF
- 🔄 Share thread via link
- 🔄 Markdown editor for refinements

### UX improvements

- 🔄 Mobile-optimized sidebar (collapse/expand)
- 🔄 Keyboard shortcuts
- 🔄 Dark mode
- 🔄 Thread templates
- 🔄 Favorites/pinned threads

## notes for developers

### architecture decisions

- **Chat interface**: More intuitive than form-based UI
- **IndexedDB first**: Works offline, no backend dependency
- **Modular storage**: Easy migration path to API
- **PascalCase schemas**: Consistency with type naming
- **Separate schemas/types**: Clear separation of concerns
- **Interface abstraction**: Enables easy testing and swapping

### styling approach

- Tailwind utility classes for rapid development
- Gradient backgrounds for visual appeal
- Smooth animations for polish
- Responsive design considerations
- Loading states for better UX

### performance optimizations

- IndexedDB indexes on frequently queried fields
- React key optimization with unique IDs
- Markdown memoization to prevent re-renders
- Efficient auto-scroll (only on message count change)
- Streaming prevents UI blocking

### testing considerations

- Storage interface makes mocking easy
- Custom hooks are unit-testable
- Components separated by concern
- Clear prop types for integration tests
