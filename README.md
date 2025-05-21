## About

Hydra is a javascript framework I made for a personal project of mine. It is made for modifying websites that were compiled with webpack, without having to modify the giant `.chunk.js` files directly.

I cannot guarantee that this project works properly for any specific code you make, but I will fix any bugs that I encounter while using it.

_Yes_, the mixin naming and tagging system is inspired by SpongePowered's Mixin system. I make minecraft mods, and this was a familiar way to do it.

## Tags

- **`@Inject(method: string, at: @At, ordinal?: number = 0)`**
  - Injects code into the function marked by this tag, either at the start or the end of the `method` function.
  - If multiple functions with the same name exist in the source file and have the same number of parameters, the `ordinal` parameter will determine which method is targeted.

- **`@At("HEAD" | "TAIL")`**
  - Used with the `@Inject` tag to specify whether the code should be injected at the start ("HEAD") or the end ("TAIL") of the method.
  > [!WARNING]
  > Currently, the `"TAIL"` option puts the code at the total end of the method, ignoring return statements, so your code will probably be unreachable. This will be fixed in the future, but as of now, it's not recommended to use it.

- **`@Unique`**

  - Inserts the marked class or function at the start of the exported file.
