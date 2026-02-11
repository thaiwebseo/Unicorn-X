export function getNested(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current === null || current === undefined) return undefined;
        // Handle array indices like "items[0]"
        if (key.includes('[') && key.includes(']')) {
            const [arrayName, indexStr] = key.split('[');
            const index = parseInt(indexStr.replace(']', ''), 10);
            current = current[arrayName]?.[index];
        } else {
            current = current[key];
        }
    }
    return current;
}

export function setNested(obj: any, path: string, value: any): any {
    if (!obj || !path) return obj;

    // Create a deep clone to avoid mutating the original object directly if possible, 
    // but for this utility we assume we might be working with a draft or we clone at the call site.
    // For React state, ideally we should clone. Here we will do a simple implementation 
    // that mutates the object structure passed in, assuming the caller passes a clone or uses immer.
    // BUT since we are replacing a specific path, let's try to return a new object structure (shallow copies along the path)
    // to function more like an immutable update if possible, OR just mutate for simplicity if using simple state.

    // For simplicity in this project context with standard React useState, 
    // it's often easier to structuredClone the whole object before calling this, 
    // OR we implement immutable update logic here.

    // Let's implement a mutable version that expects the caller to have cloned the root object.
    // This is efficient and keeps this utility simple.

    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        let key = keys[i];
        let index = -1;

        // Check for array syntax "prop[0]"
        if (key.includes('[') && key.endsWith(']')) {
            const parts = key.split('[');
            key = parts[0];
            index = parseInt(parts[1].replace(']', ''), 10);
        }

        if (index > -1) {
            // It's an array access
            if (!current[key]) current[key] = [];
            if (!current[key][index]) current[key][index] = {};
            current = current[key][index];
        } else {
            // Standard object property
            if (!current[key]) current[key] = {};
            current = current[key];
        }
    }

    // Set the value on the last key
    const lastKey = keys[keys.length - 1];
    if (lastKey.includes('[') && lastKey.endsWith(']')) {
        const parts = lastKey.split('[');
        const key = parts[0];
        const index = parseInt(parts[1].replace(']', ''), 10);
        if (!current[key]) current[key] = [];
        current[key][index] = value;
    } else {
        current[lastKey] = value;
    }

    return obj;
}
