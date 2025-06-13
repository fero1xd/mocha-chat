import { MODELS, ModelType } from "@/lib/models";
import { useEffect, useState } from "react";

const KEY = 'selected_model';
const DEFAULT_MODEL = 'Gemini 2.5 Flash';

export function useModel() {
    let fromLocal = localStorage.getItem(KEY) as ModelType | null;
    const isValid = fromLocal && MODELS.includes(fromLocal);
    if (!isValid) {
        fromLocal = null;
    }

    const [model, setModel] = useState<ModelType | null>(null);

    useEffect(() => {
        model && localStorage.setItem(KEY, model);
    }, [model])


    return { model: model ?? fromLocal ?? DEFAULT_MODEL, setModel };
}