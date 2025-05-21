## About
I'm too lazy to write this part right now—I'll get to it later. :P

---

## Stable Tags

- **`@Inject(method: string, at: At(BASE), ordinal?: number = 0)`**
    - Injects code into the function marked by this tag, either at the start or the end of the `method` function.
    - If multiple functions with the same name exist in the source file and have the same number of parameters, the `ordinal` parameter will determine which method is targeted.
    
- **`@Unique`**
    - Inserts the marked class or function at the start of the exported file.

- **`@At(at: string ("HEAD" | "TAIL"))`** (alias `At(BASE)`)
    - Used with the `@Inject` tag to specify whether the code should be injected at the start ("HEAD") or the end ("TAIL") of the method.

---

## Experimental Tags

> [!WARNING]
> These tags are experimental and may have bugs. If you encounter any, please report them.

- **`@ModifyReturnValue(method: string, at: At(EXTENDED), ordinal?: number = 0)`**
    - Modifies the return value of a method call in the specified `method`, based on the `at` location.
    - The behavior of the `ordinal` and other parameters is similar to that of the `@Inject` tag.

- **`@At(method: string, ordinal?: number = 0)`** (alias `At(EXTENDED)`)
    - Used with the `@ModifyReturnValue` tag to specify which method call should have its return value modified.
