import React, { useMemo } from "react";
import { Sankey, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SessionAnalyticsTrendsPeriod } from "./utils";
import { SessionAnalyticsAllDataSuccessResponse } from "@/services/session-analytics";

const chartConfig = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
} as ChartConfig;

interface ProbabilityWeightedFlowJourneyCardProps {
  period: SessionAnalyticsTrendsPeriod;
  userSessions: SessionAnalyticsAllDataSuccessResponse["sessions"] | undefined;
}
const ProbabilityWeightedFlowJourneyCard = ({
  userSessions,
}: ProbabilityWeightedFlowJourneyCardProps) => {
  const nodes = useMemo(() => {
    const uniquePages = new Set<string>();
    userSessions?.forEach((session) => {
      session.session_details.forEach((curr) => {
        if (curr.event_name === "page_visit" && curr.event_value) {
          uniquePages.add(curr.event_value);
        }
      });
    });
    return Array.from(uniquePages).map((page) => ({ name: page }));
  }, [userSessions]);
  const nodeIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    nodes.forEach((node, index) => {
      map[node.name] = index;
    });
    return map;
  }, [nodes]);

  const links = useMemo(() => {
    const linkMap: Record<string, number> = {};
    userSessions?.forEach((session) => {
      const pageVisits = session.session_details.filter(
        (event) => event.event_name === "page_visit" && event.event_value,
      );
      for (let i = 0; i < pageVisits.length - 1; i++) {
        const source = pageVisits[i].event_value!;
        const target = pageVisits[i + 1].event_value!;
        const key = `${source}->${target}`;
        linkMap[key] = (linkMap[key] || 0) + 1;
      }
    });
    return Object.entries(linkMap).map(([key, value]) => {
      const [source, target] = key.split("->");
      return {
        source: nodeIndexMap[source],
        target: nodeIndexMap[target],
        value,
      };
    });
  }, [userSessions, nodeIndexMap]);

  const chart1Data = useMemo(() => {
    if (!nodes.length || !links.length) {
      return { nodes: [], links: [] };
    }
    // here we compare our assumption of user flow vs actual user flow
    // our flow is sorted from first page to next page

    const ourUserJourneyAssumption = [
      "Ideation",
      "Project Context Chat",
      "Project Loading",
      "Individual Module Page",
      "Module Designs",
    ];
    // const ourUserJourneyAssumption = [
    //   "Projects Listing",
    //   "Project Loading",
    //   "Modules Listing",
    //   "Individual Module Page",
    //   "Module Designs",
    // ];

    // we want to see how many users follow this exact path, vs where they drop off or diverge
    // avoid cycles, i want the same nodes but only 2 edges
    // 1 edge to next node and 1 edge to drop off or divergence

    const finalNodes = ourUserJourneyAssumption.map((page) => ({ name: page }));
    const finalNodeIndexMap: Record<string, number> = {};
    finalNodes.forEach((node, index) => {
      finalNodeIndexMap[node.name] = index;
    });
    const finalLinks: { source: number; target: number; value: number }[] = [];
    links.forEach((link) => {
      const sourceName = nodes[link.source].name;
      const targetName = nodes[link.target].name;
      const sourceIndex = finalNodeIndexMap[sourceName];
      const targetIndex = finalNodeIndexMap[targetName];
      if (sourceIndex !== undefined && targetIndex !== undefined) {
        // if this link is part of our assumed user journey, add it to the final links
        if (targetIndex === sourceIndex + 1) {
          finalLinks.push({
            source: sourceIndex,
            target: targetIndex,
            value: link.value,
          });
        } else {
          // otherwise, it's a divergence or drop-off
          finalLinks.push({
            source: sourceIndex,
            target: finalNodes.length,
            value: link.value,
          });
        }
      }
    });
    // add a special node for divergences
    finalNodes.push({ name: "Divergence/Drop-off" });
    return { nodes: finalNodes, links: finalLinks };
  }, [nodes, links]);

  return (
    <Card className="border-slate-800 bg-gray-900 text-slate-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Fresh Projects Flow</CardTitle>
        <CardDescription className="mt-1 text-xs text-slate-400">
          This Sankey diagram visualizes the flow of users through the key
          stages of our product for new projects. It shows how many users follow
          the ideal path from Ideation to Module Designs, and where users tend
          to drop off or diverge from this path.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <Sankey
            width={500}
            height={300}
            data={{
              nodes: chart1Data.nodes,
              links: chart1Data.links,
            }}
            nodePadding={50}
            nodeWidth={15}
          >
            <Tooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  title="User Journey"
                  formatter={(value, _name, props) => {
                    const payload = props.payload?.payload ?? {};
                    if (payload.source && payload.target) {
                      return (
                        <div>
                          <div>{`From: ${payload.source?.name}`}</div>
                          <div>{`To: ${payload.target?.name}`}</div>
                          <div>{`Value: ${payload.value}`}</div>
                        </div>
                      );
                    } else if (payload.name) {
                      return (
                        <div>
                          <div>{`Node: ${payload.name}`}</div>
                          <div>{`Value: ${payload.value}`}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              }
            />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProbabilityWeightedFlowJourneyCard;
