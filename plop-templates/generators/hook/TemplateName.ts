import { useState } from "react";

type TTypeNameReponse = string;

function TemplateName(): TTypeNameReponse {
  const [value, setValue] = useState<string>("default");

  return value;
}

export default TemplateName;
