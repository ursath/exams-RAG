from langchain_text_splitters import MarkdownHeaderTextSplitter


class ChunkingService:

    def chunk(self, text:str, strip_headers:bool = False):
        # chunk by headers
        # check if topics are used in the future
        headers_to_split_on = [ ("#", "main_topic"), ("##", "topics"), ("###", "topics"), ("####", "topics")]

        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on, strip_headers=strip_headers)

        # doc objects already with metadata field
        chunks = markdown_splitter.split_text(text)

        return chunks

chunking_service = ChunkingService()