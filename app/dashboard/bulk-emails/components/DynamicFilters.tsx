"use client";

import { useState } from "react";
import {
  useBulkEmailsStore,
  Conditional,
} from "@/lib/store/useBulkEmailsStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatFilterLabel,
  getOperatorOptions,
  validateConditional,
} from "./utils";
import { X, Plus } from "lucide-react";

const AVAILABLE_METRICS = [
  "Total Users",
  "Total Projects",
  "Initial Brainstorming Agent",
  "Product Roadmap",
  "Selections made (MVP)",
  "Artus Chat (MVP)",
  "MVP Implemented",
  "Product Description Agent",
  "Market Research Started",
  "Market Research Completed",
  "Analyst Agent",
  "Designer Agent",
  "Variants Created",
  "BRD Created",
  "FRD Created",
  "User Stories Created",
  "Test Cases Created",
  "Page Clicks",
  "Users Out of Credits",
];

interface NewConditionalForm {
  metric: string;
  operator: string;
  value: string;
}

export function DynamicFilters() {
  const { dynamicFilters, addDynamicFilter, removeDynamicFilter } =
    useBulkEmailsStore();
  const [newConditional, setNewConditional] = useState<NewConditionalForm>({
    metric: "",
    operator: "=",
    value: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddFilter = () => {
    setFormError(null);

    if (!newConditional.metric) {
      setFormError("Please select a metric");
      return;
    }

    if (
      !validateConditional(
        newConditional.metric,
        newConditional.operator,
        newConditional.value,
      )
    ) {
      setFormError("Please enter a valid value");
      return;
    }

    // Try to parse as number, otherwise keep as string
    let value: string | number = newConditional.value;
    const numValue = parseFloat(newConditional.value);
    if (!isNaN(numValue)) {
      value = numValue;
    }

    const conditional: Conditional = {
      metric: newConditional.metric,
      operator: newConditional.operator as "=" | "!=" | ">" | ">=" | "<" | "<=",
      value,
    };

    addDynamicFilter(conditional);
    setNewConditional({ metric: "", operator: "=", value: "" });
  };

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Dynamic Filters</CardTitle>
        <CardDescription>
          Add conditional filters using AND logic (all conditions must be true)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Filters */}
        {dynamicFilters.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {dynamicFilters.length} Condition
              {dynamicFilters.length > 1 ? "s" : ""} Added
            </Label>
            <div className="space-y-2">
              {dynamicFilters.map((filter, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-900 px-3 py-1 rounded-md border border-slate-800"
                >
                  <div className="flex-1">
                    <span className="text-sm">
                      <strong>{formatFilterLabel(filter.metric)}</strong>{" "}
                      {filter.operator}{" "}
                      <strong>{filter.value?.toString()}</strong>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDynamicFilter(idx)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Separator />

        {/* Add New Filter Form */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Add New Filter</Label>

          <div className="grid grid-cols-10 gap-3 items-end">
            {/* Metric Select */}
            <div className="space-y-2 col-span-5">
              <Label htmlFor="metric-select" className="text-xs">
                Metric
              </Label>
              <Select
                value={newConditional.metric}
                onValueChange={(value) =>
                  setNewConditional({ ...newConditional, metric: value })
                }
              >
                <SelectTrigger id="metric-select" className="text-sm w-full">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_METRICS.map((metric) => (
                    <SelectItem key={metric} value={metric}>
                      {metric}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operator Select */}
            <div className="space-y-2">
              <Label htmlFor="operator-select" className="text-xs">
                Operator
              </Label>
              <Select
                value={newConditional.operator}
                onValueChange={(value) =>
                  setNewConditional({ ...newConditional, operator: value })
                }
              >
                <SelectTrigger id="operator-select" className="text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getOperatorOptions().map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value Input */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="value-input" className="text-xs">
                Value
              </Label>
              <Input
                id="value-input"
                type="text"
                placeholder="Enter value"
                value={newConditional.value}
                onChange={(e) =>
                  setNewConditional({
                    ...newConditional,
                    value: e.target.value,
                  })
                }
                className="text-sm w-full"
              />
            </div>

            {/* Add Button */}
            <Button onClick={handleAddFilter} className="w-full col-span-2">
              <Plus className="w-4 h-4" />
              Add Filter
            </Button>
          </div>

          {/* Error Message */}
          {formError && (
            <p className="text-sm text-red-600 flex items-center gap-2">
              <span className="inline-block">⚠️</span> {formError}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
