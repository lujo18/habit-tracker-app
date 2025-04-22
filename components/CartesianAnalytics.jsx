import { View } from "react-native";
import React, { useMemo } from "react";
import { CartesianChart, useAnimatedPath, useAreaPath, useChartPressState, useLinePath } from "victory-native";
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
  Line
} from "@shopify/react-native-skia";
import tailwindConfig from "../tailwind.config";
const tailwindColors = tailwindConfig.theme.extend.colors;

const fontMgr = Skia.FontMgr.System();
const typeFace = fontMgr.matchFamilyStyle("System", FontStyle.Normal);
const font = Skia.Font(typeFace, 12);

const CartesianAnalytics = ({ data, xKey, yKeys }) => {
  const {state, isActive} = useChartPressState({x: 0, y: {completionCount : 0}})

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

  function ToolTip({x, y, bottom, height}) {
    console.log("Tooltip values - x:", x.value, "bottom:", bottom, "height:", height);

    
    const path = Skia.Path.Make()
    path.moveTo(x.value, bottom)
    path.lineTo(x.value, bottom - height)

    //const animPath = useAnimatedPath(path)
    
    return (
      <>
        <Path path={path} style="stroke" color={tailwindColors["background"][60]} strokeWidth={2}/>
        <Circle cx={x} cy={y} r={4} color={"white"} />
      </>
    )
  }

  return (
    <View className="w-full h-[300px]">
      <CartesianChart
        data={data}
        xKey={xKey}
        yKeys={yKeys}
        padding={20}
        xAxis={{
          lineColor: tailwindColors["background"][80],
          lineWidth: 2,
          linePathEffect: <DashPathEffect intervals={[4, 4]} />,
        }}
        axisOptions={{ font }}
        chartPressState={state}
      >
        {({ points, chartBounds, canvasSize }) => {
          // Ensure points and chartBounds are valid
          if (!points || !chartBounds) return null;
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
  );
};

export default CartesianAnalytics;
