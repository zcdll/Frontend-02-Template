const str = "😊";

for (const item of str) {
  console.log(item.codePointAt(0).toString(16), "---item");
}
