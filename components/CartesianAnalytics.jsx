import { View, Text } from "react-native";
import React, { useEffect, useMemo } from "react";
import { CartesianChart, useAnimatedPath, useAreaPath, useChartPressState, useLinePath} from "victory-native";
import {
  Circle,
  DashPathEffect,
  LinearGradient,
  Path,
  Points,
  vec,
  Skia,
  Font,
  FontStyle,
  Line,
  Rect,

  Canvas
} from "@shopify/react-native-skia";
import tailwindConfig from "../tailwind.config";
const tailwindColors = tailwindConfig.theme.extend.colors;

const fontMgr = Skia.FontMgr.System();
const typeFace = fontMgr.matchFamilyStyle("System", FontStyle.Normal);
const font = Skia.Font(typeFace, 12);

const CartesianAnalytics = ({ data, xKey, yKeys }) => {
  const {state, isActive} = useChartPressState({x: 0, y: {completionCount : 0}})

  try {
  // AreaChart component to render the area chart

  const AreaChart = ({ points, bottom, height }) => {
    const { path } = useAreaPath(points, bottom, { curveType: "linear" }); // Use curveLinear
    const { path: linePath } = useLinePath(points, bottom, {
      curveType: "linear",
    });
    return (
      <>
        <Path path={path} style="fill">
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={[tailwindColors["background"][70], "transparent"]}
          />
        </Path>
        <Path path={linePath} style="stroke" strokeWidth={2} color="white" />
      </>
    );
  };

  const ToolTip = ({x, y, bottom, height}) => {

    return (
      <>
        <Rect x={x} y={0} height={height} width={1} color={"white"}/>
        <Circle cx={x} cy={y} r={7} color={"black"} strokeWidth={1}/>
        <Circle cx={x} cy={y} r={5} color={"white"} strokeWidth={1}/>
        
        
      </>
    )
  }

  return (
    <View className="w-full">
      <Text>Habit Progress</Text>
      <View className="w-full h-[300px]">
        <CartesianChart
          data={data}
          xKey={xKey}
          yKeys={yKeys}
          domainPadding={{top: 40, bottom: 40, left: 20, right: 20}}
          padding={20}
          xAxis={{
            lineColor: tailwindColors["background"][80],
            lineWidth: 2,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          }}
      
          yAxis={[{domain: [0, undefined]}]}
          axisOptions={{ font }}
          chartPressState={state}
      
        >
          {({ points, chartBounds, canvasSize }) => {
            // Ensure points and chartBounds are valid
            console.log(data)
            if (!points || !chartBounds) {
              console.log("poings or chartBounds are null")
              return null
            };
            return (
              <>
                <AreaChart
                  points={points.completionCount}
                  bottom={chartBounds.bottom}
                  height={canvasSize.height}
                />
                {isActive &&
                  <ToolTip x={state.x.position} y={state.y.completionCount.position} bottom={chartBounds.bottom} height={canvasSize.height}/>
                }
              </>
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
  } catch (err) {console.log("Failed to load graph ", err)} 
};

export default CartesianAnalytics;
