"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PERIOD_LABELS, SessionAnalyticsTrendsPeriod } from "./utils";
import { SessionAnalyticsAllDataSuccessResponse } from "@/services/session-analytics";

interface ProbabilityWeightedFlowJourneyCardProps {
  period: SessionAnalyticsTrendsPeriod;
  userSessions: SessionAnalyticsAllDataSuccessResponse["sessions"] | undefined;
}
interface Transition {
  source: string;
  target: string;
  count: number;
  probability: number;
}

const MAX_VISIBLE_EDGES = 80;
const MAX_TRANSITIONS_PER_NODE = 1;

const getStateLabel = (
  event: SessionAnalyticsAllDataSuccessResponse["sessions"][0]["session_details"][0],
): string | null => {
  if (!event.event_value) {
    return null;
  }

  if (event.event_name === "page_visit") {
    return event.event_value;
  }

  return null;
};

const ProbabilityWeightedFlowJourneyCard = ({
  period,
  userSessions,
}: ProbabilityWeightedFlowJourneyCardProps) => {
  const {
    nodes,
    edges,
    strongestTransition,
    mostCommonStartState,
    mostCommonStartStateCount,
  } = useMemo(() => {
    if (!userSessions || userSessions.length === 0) {
      return {
        nodes: [] as Node[],
        edges: [] as Edge[],
        strongestTransition: null,
        mostCommonStartState: null,
        mostCommonStartStateCount: 0,
      };
    }

    const edgeCountMap = new Map<string, number>();
    const nodeVisitMap = new Map<string, number>();
    const outgoingTotalMap = new Map<string, number>();
    const startStateMap = new Map<string, number>();

    userSessions.forEach((session) => {
      const sequence = (session.session_details ?? [])
        .map(getStateLabel)
        .filter((label): label is string => Boolean(label));

      if (sequence.length === 0) {
        return;
      }

      const normalizedSequence: string[] = [];
      sequence.forEach((state) => {
        if (normalizedSequence[normalizedSequence.length - 1] !== state) {
          normalizedSequence.push(state);
        }
      });

      if (normalizedSequence.length === 0) {
        return;
      }

      const startState = normalizedSequence[0];
      startStateMap.set(startState, (startStateMap.get(startState) ?? 0) + 1);

      normalizedSequence.forEach((state) => {
        nodeVisitMap.set(state, (nodeVisitMap.get(state) ?? 0) + 1);
      });

      for (let index = 0; index < normalizedSequence.length - 1; index += 1) {
        const source = normalizedSequence[index];
        const target = normalizedSequence[index + 1];
        const key = `${source}>>${target}`;

        edgeCountMap.set(key, (edgeCountMap.get(key) ?? 0) + 1);
        outgoingTotalMap.set(source, (outgoingTotalMap.get(source) ?? 0) + 1);
      }
    });

    const transitions = Array.from(edgeCountMap.entries())
      .map(([key, count]) => {
        const [source, target] = key.split(">>");
        const outgoingTotal = outgoingTotalMap.get(source) ?? 1;
        return {
          source,
          target,
          count,
          probability: count / outgoingTotal,
        } satisfies Transition;
      })
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return b.probability - a.probability;
      })
      .filter(() => true)
      .reduce<Transition[]>((selectedTransitions, transition) => {
        const outgoingTransitionsFromSource = selectedTransitions.filter(
          (selectedTransition) =>
            selectedTransition.source === transition.source,
        ).length;

        if (outgoingTransitionsFromSource >= MAX_TRANSITIONS_PER_NODE) {
          return selectedTransitions;
        }

        selectedTransitions.push(transition);
        return selectedTransitions;
      }, [])
      .slice(0, MAX_VISIBLE_EDGES);

    const stateSet = new Set<string>();
    transitions.forEach((transition) => {
      stateSet.add(transition.source);
      stateSet.add(transition.target);
    });

    const states = Array.from(stateSet);
    const stateToNodeId = new Map(
      states.map((state, idx) => [state, `q${idx}`]),
    );
    const nodeIdToState = new Map(
      states.map((state, idx) => [`q${idx}`, state]),
    );

    const topStartEntry = Array.from(startStateMap.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0] ?? [null, 0];
    const topStartState = topStartEntry[0];

    const adjacency = new Map<string, Set<string>>();
    const incoming = new Map<string, Set<string>>();
    transitions.forEach((transition) => {
      const sourceId = stateToNodeId.get(transition.source);
      const targetId = stateToNodeId.get(transition.target);
      if (!sourceId || !targetId) {
        return;
      }

      if (!adjacency.has(sourceId)) {
        adjacency.set(sourceId, new Set<string>());
      }

      adjacency.get(sourceId)?.add(targetId);

      if (!incoming.has(targetId)) {
        incoming.set(targetId, new Set<string>());
      }

      incoming.get(targetId)?.add(sourceId);
    });

    const levels = new Map<string, number>();
    const queue: string[] = [];

    if (topStartState) {
      const topStartNodeId = stateToNodeId.get(topStartState);
      if (topStartNodeId) {
        levels.set(topStartNodeId, 0);
        queue.push(topStartNodeId);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        continue;
      }

      const nextLevel = (levels.get(current) ?? 0) + 1;
      const neighbors = adjacency.get(current);
      if (!neighbors) {
        continue;
      }

      neighbors.forEach((neighbor) => {
        const knownLevel = levels.get(neighbor);
        if (knownLevel == null || nextLevel < knownLevel) {
          levels.set(neighbor, nextLevel);
          queue.push(neighbor);
        }
      });
    }

    let fallbackLevel =
      levels.size > 0 ? Math.max(...Array.from(levels.values())) + 1 : 0;
    states.forEach((state) => {
      const id = stateToNodeId.get(state);
      if (!id) {
        return;
      }

      if (!levels.has(id)) {
        levels.set(id, fallbackLevel);
        fallbackLevel += 1;
      }
    });

    const statesByLevel = new Map<number, string[]>();
    levels.forEach((level, nodeId) => {
      if (!statesByLevel.has(level)) {
        statesByLevel.set(level, []);
      }
      statesByLevel.get(level)?.push(nodeId);
    });

    const orderedNodeIdsByLevel = new Map<number, string[]>();
    const orderedLevels = Array.from(statesByLevel.keys()).sort(
      (a, b) => a - b,
    );

    orderedLevels.forEach((level) => {
      const nodeIds = [...(statesByLevel.get(level) ?? [])];

      if (level === 0) {
        nodeIds.sort((first, second) => {
          const firstState = nodeIdToState.get(first) ?? "";
          const secondState = nodeIdToState.get(second) ?? "";
          return (
            (nodeVisitMap.get(secondState) ?? 0) -
            (nodeVisitMap.get(firstState) ?? 0)
          );
        });

        orderedNodeIdsByLevel.set(level, nodeIds);
        return;
      }

      const previousLevelOrder = orderedNodeIdsByLevel.get(level - 1) ?? [];
      const parentPosition = new Map(
        previousLevelOrder.map((nodeId, index) => [nodeId, index]),
      );

      nodeIds.sort((first, second) => {
        const firstParents = Array.from(incoming.get(first) ?? []).filter(
          (parentId) => parentPosition.has(parentId),
        );
        const secondParents = Array.from(incoming.get(second) ?? []).filter(
          (parentId) => parentPosition.has(parentId),
        );

        const firstParentPositions = firstParents
          .map(
            (parentId) =>
              parentPosition.get(parentId) ?? Number.MAX_SAFE_INTEGER,
          )
          .sort((a, b) => a - b);
        const secondParentPositions = secondParents
          .map(
            (parentId) =>
              parentPosition.get(parentId) ?? Number.MAX_SAFE_INTEGER,
          )
          .sort((a, b) => a - b);

        const firstHasParent = firstParentPositions.length > 0;
        const secondHasParent = secondParentPositions.length > 0;
        if (firstHasParent !== secondHasParent) {
          return firstHasParent ? -1 : 1;
        }

        const firstMinParent =
          firstParentPositions[0] ?? Number.MAX_SAFE_INTEGER;
        const secondMinParent =
          secondParentPositions[0] ?? Number.MAX_SAFE_INTEGER;
        if (firstMinParent !== secondMinParent) {
          return firstMinParent - secondMinParent;
        }

        const firstAvgParent =
          firstParentPositions.reduce((sum, value) => sum + value, 0) /
          Math.max(firstParentPositions.length, 1);
        const secondAvgParent =
          secondParentPositions.reduce((sum, value) => sum + value, 0) /
          Math.max(secondParentPositions.length, 1);
        if (firstAvgParent !== secondAvgParent) {
          return firstAvgParent - secondAvgParent;
        }

        const firstState = nodeIdToState.get(first) ?? "";
        const secondState = nodeIdToState.get(second) ?? "";
        return (
          (nodeVisitMap.get(secondState) ?? 0) -
          (nodeVisitMap.get(firstState) ?? 0)
        );
      });

      orderedNodeIdsByLevel.set(level, nodeIds);
    });

    const graphNodes: Node[] = [];
    orderedLevels.forEach((level) => {
      const nodeIds = orderedNodeIdsByLevel.get(level) ?? [];

      nodeIds.forEach((nodeId, index) => {
        const stateName = nodeIdToState.get(nodeId) ?? nodeId;
        const visitCount = nodeVisitMap.get(stateName) ?? 0;
        const isStart = stateName === topStartState;

        graphNodes.push({
          id: nodeId,
          position: { x: level * 260, y: index * 180 },
          data: {
            label: `${stateName}\n${visitCount.toLocaleString()} visits`,
          },
          style: {
            width: 120,
            height: 120,
            borderRadius: "9999px",
            border: isStart ? "3px solid #22d3ee" : "2px solid #334155",
            background: isStart ? "#0f172a" : "#111827",
            color: "#e2e8f0",
            fontSize: "11px",
            lineHeight: "1.3",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            whiteSpace: "pre-line",
          },
          draggable: false,
        });
      });
    });

    const mappedGraphEdges: Array<Edge | null> = transitions.map(
      (transition) => {
        const sourceId = stateToNodeId.get(transition.source);
        const targetId = stateToNodeId.get(transition.target);

        if (!sourceId || !targetId) {
          return null;
        }

        return {
          id: `${sourceId}->${targetId}`,
          source: sourceId,
          target: targetId,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#38bdf8",
          },
          label: `${(transition.probability * 100).toFixed(1)}%`,
          labelStyle: {
            // fill: "#cbd5e1",
            fontSize: 10,
            fontWeight: 600,
          },
          style: {
            stroke: "#38bdf8",
            strokeOpacity: Math.min(0.35 + transition.probability, 1),
            strokeWidth: Math.min(1 + transition.count * 0.15, 4),
          },
          data: {
            count: transition.count,
            probability: transition.probability,
          },
        } as Edge;
      },
    );

    const graphEdges: Edge[] = mappedGraphEdges.filter(
      (edge): edge is Edge => edge !== null,
    );

    return {
      nodes: graphNodes,
      edges: graphEdges,
      strongestTransition: transitions[0] ?? null,
      mostCommonStartState: topStartState,
      mostCommonStartStateCount: topStartEntry[1],
    };
  }, [userSessions]);

  const hasGraphData = nodes.length > 0 && edges.length > 0;

  return (
    <Card className="border-slate-800 bg-gray-900 text-slate-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Probability Weighted Flow Journey
        </CardTitle>
        <CardDescription className="mt-1 text-xs text-slate-400">
          Visualize the most common user journeys through your application,
          weighted by the probability of conversion over the{" "}
          {PERIOD_LABELS[period]}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasGraphData ? (
          <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/40 text-sm text-slate-400">
            No state graph data is available for the selected period.
          </div>
        ) : (
          <>
            <div className="h-[50vh]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                fitViewOptions={{ padding: 0.25 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable
                minZoom={0.25}
                maxZoom={1.5}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#1e293b" gap={24} size={1} />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>

            <div className="mt-4 grid gap-2 text-xs text-slate-200 sm:grid-cols-2">
              <div className="rounded-md border border-slate-700/60 bg-slate-900/70 p-2">
                <p className="text-slate-400">Most Common Start State</p>
                <p className="mt-1 font-medium text-slate-100">
                  {mostCommonStartState ?? "N/A"}
                </p>
                <p className="text-slate-400">
                  {mostCommonStartStateCount.toLocaleString()} sessions
                </p>
              </div>

              <div className="rounded-md border border-slate-700/60 bg-slate-900/70 p-2">
                <p className="text-slate-400">Strongest Transition</p>
                <p className="mt-1 font-medium text-slate-100">
                  {strongestTransition
                    ? `${strongestTransition.source} -> ${strongestTransition.target}`
                    : "N/A"}
                </p>
                <p className="text-slate-400">
                  {strongestTransition
                    ? `${(strongestTransition.probability * 100).toFixed(1)}% (${strongestTransition.count.toLocaleString()} transitions)`
                    : "N/A"}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProbabilityWeightedFlowJourneyCard;
