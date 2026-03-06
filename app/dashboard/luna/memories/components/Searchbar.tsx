"use client";

import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useLunaMemoriesStore } from "@/lib/store/lunaMemoriesStore";
import { SearchIcon } from "lucide-react";

function Searchbar() {
  const searchInput = useLunaMemoriesStore((state) => state.searchInput);
  const setSearchInput = useLunaMemoriesStore((state) => state.setSearchInput);
  return (
    <Field>
      <InputGroup>
        <InputGroupInput
          id="input-group-search-memories"
          placeholder="Search Memories..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="text-sm"
        />
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export default Searchbar;
