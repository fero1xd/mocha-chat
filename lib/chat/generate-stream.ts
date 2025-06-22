import { useModel } from "@/stores/model";
import { useCurrentGeneration } from "@/stores/use-current-generation";
import { Message, processDataStream } from "ai";
import { betterJsonParse } from "../utils";

type Args = {
  messages: Message[];
  messageId: string;
  threadId: string;
};

export async function generateStream({ messages, messageId, threadId }: Args) {
  try {
    let index: number;
    useCurrentGeneration.setState((prev) => {
      index = prev.messages.length;
      return {
        messages: [
          ...prev.messages,
          {
            id: messageId,
            text: "",
            isDone: false,
          },
        ],
      };
    });

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: JSON.stringify({
        messages,
        messageId,
        threadId,
        model: useModel.getState().model,
      }),
    });

    if (!res.ok) {
      let emsg: string =
        "An error occured while generating a response";

      try {
        const e = await res.json();
        if (e.error) {
          emsg = e.error as string;
        }
      } catch { }

      useCurrentGeneration.setState((prev) => {
        prev.messages[index].error = emsg;
        prev.messages[index].isDone = true;
        return {
          messages: [...prev.messages],
        };
      });
      return;
    }

    let text = "";
    let reasoning = "";
    let error = "";

    processDataStream({
      stream: res.body!,
      onTextPart: (part) => {
        text += part;
        useCurrentGeneration.setState((prev) => {
          prev.messages[index].text = text;
          return {
            messages: [...prev.messages],
          };
        });
      },
      onReasoningPart: (part) => {
        reasoning += part;
        useCurrentGeneration.setState((prev) => {
          prev.messages[index].reasoning = reasoning;
          return {
            messages: [...prev.messages],
          };
        });
      },
      onFinishMessagePart: (part) => {
        console.log({ finish: part });
        useCurrentGeneration.setState((prev) => {
          prev.messages[index].isDone = true;
          return {
            messages: [...prev.messages],
          };
        });
      },
      onErrorPart: (ep) => {
        error += ep;
        useCurrentGeneration.setState((prev) => {
          prev.messages[index].error = error;
          return {
            messages: [...prev.messages],
          };
        });
      },
    });
  } catch (e) {
    console.log(e);
  }
}
