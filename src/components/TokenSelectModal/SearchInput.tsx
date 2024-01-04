import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks";
import styled from "styled-components";
import { TextInput } from "../TextInput";
export const TokenSearchInput = ({
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  const [localValue, setLocalValue] = useState("");
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    setValue(debouncedValue);
  }, [debouncedValue, setValue]);

  return (
    <StyledSearchInput
      placeholder="Insert token name..."
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
};


export const StyledSearchInput = styled(TextInput)({
  flex:1,
  color: 'white',
  marginRight: 15

});