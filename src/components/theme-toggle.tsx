"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { setTheme } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "./ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./dropdown-menu";

const modes = [
  { key: "system", label: "System", icon: Monitor },
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeToggle() {
  const theme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();
  const active = modes.find((mode) => mode.key === theme) ?? modes[0];
  const ActiveIcon = active.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-11">
          <ActiveIcon className="h-4 w-4" />
          <span className="hidden lg:inline">{active.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <DropdownMenuItem key={mode.key} onClick={() => dispatch(setTheme(mode.key))}>
              <Icon className="h-4 w-4" />
              {mode.label}
              {theme === mode.key ? <span className="ml-auto text-xs text-primary">Active</span> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
