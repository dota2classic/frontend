/* eslint-disable */
export function redirectWithPost(url: string, data: Record<string, any>): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  function addInput(name: string, value: string | number | boolean): void {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  }

  function buildFields(value: any, parentKey: string): void {
    if (Array.isArray(value)) {
      value.forEach((v, i) => buildFields(v, `${parentKey}[${i}]`));
    } else if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([key, val]) =>
        buildFields(val, `${parentKey}[${key}]`),
      );
    } else {
      addInput(parentKey, value);
    }
  }

  Object.entries(data).forEach(([key, value]) => buildFields(value, key));

  document.body.appendChild(form);
  form.submit();
}
