
export interface MarkdownOutput extends BasicOutput {
    content: string;
}

interface BasicOutput {
    filename: string | undefined;
}
