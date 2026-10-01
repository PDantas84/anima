import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';
export function Mark({
  size = 40,
  color = '#DDB8A9',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessible={false}>
      <G stroke={color} fill="none" strokeWidth={1}>
        <Ellipse cx={24} cy={22} rx={8} ry={17} rotation={-30} origin="24,22" />
        <Ellipse cx={24} cy={22} rx={8} ry={17} rotation={30} origin="24,22" />
        <Path d="M24 7v35" />
        <Circle cx={24} cy={22} r={3} />
      </G>
    </Svg>
  );
}
export function Landscape({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 500 600"
      preserveAspectRatio="xMidYMid slice"
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        style,
      ]}
      accessible={false}
    >
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3A2E42" />
          <Stop offset="1" stopColor="#967587" />
        </LinearGradient>
        <LinearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#957183" />
          <Stop offset="1" stopColor="#392C40" />
        </LinearGradient>
        <LinearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#281E36" stopOpacity="0" />
          <Stop offset="1" stopColor="#281E36" stopOpacity=".85" />
        </LinearGradient>
      </Defs>
      <Rect width={500} height={600} fill="url(#sky)" />
      <Circle cx={386} cy={139} r={63} fill="#E7BDA4" opacity={0.94} />
      <Path
        d="M0 347C100 360 178 242 305 282S430 340 500 304V600H0Z"
        fill="#A58091"
      />
      <Path
        d="M0 414C130 369 159 450 272 395S432 343 500 376V600H0Z"
        fill="url(#land)"
      />
      <Path
        d="M0 467C89 424 206 547 327 464S415 436 500 454V600H0Z"
        fill="#534053"
      />
      <Path d="M0 553C137 466 261 591 500 501V600H0Z" fill="#342B3C" />
      <Rect width={500} height={600} fill="url(#shade)" />
    </Svg>
  );
}
export function Face({
  mood,
  size = 35,
  color = '#DDC0B4',
}: {
  mood: number;
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" accessible={false}>
      <Circle
        cx={18}
        cy={18}
        r={14.5}
        stroke={color}
        strokeWidth={1.3}
        fill="none"
      />
      <G fill={color}>
        <Circle cx={12} cy={14} r={1.3} />
        <Circle cx={24} cy={14} r={1.3} />
      </G>
      <Path
        d={
          mood === 1
            ? 'M11 25q7-8 14 0'
            : mood === 2
              ? 'M12 24q6-5 12 0'
              : mood === 3
                ? 'M12 23h12'
                : mood === 4
                  ? 'M11 21q7 7 14 0'
                  : 'M10 20q8 11 16 0'
        }
        stroke={color}
        strokeWidth={1.4}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
