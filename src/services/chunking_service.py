from langchain_text_splitters import MarkdownHeaderTextSplitter


class ChunkingService:

    def chunk(text:str, strip_headers:bool = False):
        # chunk by headers
        headers_to_split_on = [ ("#", "H1"), ("##", "H2"), ("###", "H3"), ("####", "H4")]

        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on)

        # doc objects already with metadata field
        chunks = markdown_splitter.split_text(text, strip_headers)

        return chunks

chunking_service = ChunkingService()