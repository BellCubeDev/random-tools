import BaseMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";


export function Markdown({md, ...dataAttributes}: {readonly md: string} & Record<`data-${string}`, string|boolean>): React.ReactElement {
    return <div {...dataAttributes} data-is-md=''><BaseMarkdown skipHtml remarkPlugins={[remarkBreaks]}>
        {md}
    </BaseMarkdown></div>;
}
