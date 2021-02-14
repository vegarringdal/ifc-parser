

// todo, I need to build up a map of all types


export function proxyController(id: string, name: string, args: any[]) {
  const handler = {
    get: function (_target: any, prop: string, _receiver: any) {
      if (prop === "name") {
        return name;
      }
      if (prop === "id") {
        return id;
      }
      if (prop === "args") {
        return args;
      }
      return undefined;
    },
  };

  return new Proxy({}, handler);
}
