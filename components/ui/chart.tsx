"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

import type {
  Props as LegendProps,
} from "recharts/types/component/DefaultLegendContent"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Themes
 * -----------------------------------------------------------------------------------------------*/

const THEMES = {
  light: {
    chart1: "hsl(221.2 83.2% 53.3%)",
    chart2: "hsl(212 95% 68%)",
    chart3: "hsl(210 40% 96.1%)",
    chart4: "hsl(215 20.2% 65.1%)",
    chart5: "hsl(221.2 83.2% 53.3%)",
  },
  dark: {
    chart1: "hsl(221.2 83.2% 53.3%)",
    chart2: "hsl(212 95% 68%)",
    chart3: "hsl(217.2 32.6% 17.5%)",
    chart4: "hsl(215 20.2% 65.1%)",
    chart5: "hsl(221.2 83.2% 53.3%)",
  },
} as const

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | {
      color?: string
      theme?: never
    }
    | {
      color?: never
      theme: Record<keyof typeof THEMES, string>
    }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }

  return context
}

/* -------------------------------------------------------------------------------------------------
 * Chart Container
 * -----------------------------------------------------------------------------------------------*/

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-none",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />

        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})

ChartContainer.displayName = "ChartContainer"

/* -------------------------------------------------------------------------------------------------
 * Chart Style
 * -----------------------------------------------------------------------------------------------*/

function ChartStyle({
  id,
  config,
}: {
  id: string
  config: ChartConfig
}) {
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item.color || item.theme
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart="${id}"] {
${colorConfig
            .map(([key, item]) => {
              const color = item.theme?.light || item.color
              return color ? `--color-${key}: ${color};` : ""
            })
            .join("\n")}
}

.dark [data-chart="${id}"] {
${colorConfig
            .map(([key, item]) => {
              const color = item.theme?.dark || item.color
              return color ? `--color-${key}: ${color};` : ""
            })
            .join("\n")}
}
`,
      }}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "content" | "label" | "payload"
  >,
  TooltipProps<ValueType, NameType> {
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  labelClassName?: string
  payload?: any[]
  label?: any
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload

      const key = String(
        labelKey || item.dataKey || item.name || "value"
      )

      const itemConfig = getPayloadConfigFromPayload(
        config,
        item,
        key
      )

      const value =
        !labelKey && typeof label === "string"
          ? config[label]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return (
        <div className={cn("font-medium", labelClassName)}>
          {value}
        </div>
      )
    }, [
      payload,
      label,
      labelKey,
      labelFormatter,
      labelClassName,
      hideLabel,
      config,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel =
      payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-32 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel && tooltipLabel}

        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = String(
              nameKey || item.name || item.dataKey || "value"
            )

            const itemConfig = getPayloadConfigFromPayload(
              config,
              item,
              key
            )

            const indicatorColor =
              color ||
              item.payload?.fill ||
              item.color ||
              "var(--primary)"

            return (
              <div
                key={`${key}-${index}`}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2",
                  "[&>svg]:h-2.5 [&>svg]:w-2.5",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter &&
                  item?.value !== undefined &&
                  item.name ? (
                  formatter(
                    item.value,
                    item.name,
                    item,
                    index,
                    payload
                  )
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px]",
                            {
                              "h-2.5 w-2.5":
                                indicator === "dot",
                              "w-1":
                                indicator === "line",
                              "w-0 border-l-2 border-dashed bg-transparent":
                                indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              backgroundColor:
                                indicator !== "dashed"
                                  ? indicatorColor
                                  : undefined,
                              borderColor:
                                indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}

                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel
                          ? "items-end"
                          : "items-center"
                      )}
                    >
                      <div className="grid gap-1">
                        {nestLabel && tooltipLabel}

                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>

                      {item.value !== undefined && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {Number(item.value).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

ChartTooltipContent.displayName = "ChartTooltipContent"

/* -------------------------------------------------------------------------------------------------
 * Legend
 * -----------------------------------------------------------------------------------------------*/

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
  Pick<LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean
    nameKey?: string
  }
>(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = "bottom",
      nameKey,
    },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top"
            ? "pb-3"
            : "pt-3",
          className
        )}
      >
        {payload.map((item, index) => {
          const key = String(
            nameKey || item.dataKey || "value"
          )

          const itemConfig = getPayloadConfigFromPayload(
            config,
            item,
            key
          )

          return (
            <div
              key={`${key}-${index}`}
              className="flex items-center gap-1.5"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}

              <span>
                {itemConfig?.label || item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)

ChartLegendContent.displayName = "ChartLegendContent"

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (
    typeof payload !== "object" ||
    payload === null
  ) {
    return undefined
  }

  const nestedPayload =
    "payload" in payload &&
      typeof payload.payload === "object" &&
      payload.payload !== null
      ? payload.payload
      : undefined

  let configKey = key

  if (
    nestedPayload &&
    key in nestedPayload &&
    typeof nestedPayload[
    key as keyof typeof nestedPayload
    ] === "string"
  ) {
    configKey = nestedPayload[
      key as keyof typeof nestedPayload
    ] as string
  } else if (
    nestedPayload &&
    "name" in nestedPayload &&
    typeof nestedPayload.name === "string"
  ) {
    configKey = nestedPayload.name
  }

  return (
    config[configKey] ||
    config[key]
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}