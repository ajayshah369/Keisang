import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export type DataType = {
  date: string;
  value: number;
}[];

const createSortedArray = (maxValue: number, length: number): number[] => {
  const interval = maxValue / (length - 1);
  return Array.from({ length }, (_, i) => i * interval);
};

const getMaxTick = (max: number, i: number): number => {
  const r = max % 6;
  const maxTick = Math.ceilToNearest(max + (r !== 0 ? 6 - r : 0));

  if (i > 5) return maxTick;

  if (maxTick % 6 === 0) {
    return maxTick;
  } else {
    return getMaxTick(maxTick, i + 1);
  }
};

const CustomBarChart = ({ data }: { data: DataType }) => {
  const max = Math.max(...data.map((item) => item.value));
  const maxTick = getMaxTick(max, 1);

  const yAxisTicks = createSortedArray(maxTick, 7);
  let horizontalPoints = [...yAxisTicks];
  horizontalPoints.pop();
  horizontalPoints = horizontalPoints.map((_tick, index) => index * 50 + 40);

  return (
    <div className='max-w-full overflow-auto'>
      <ResponsiveContainer
        width='100%'
        minWidth={1000}
        height={400}
        className='bg-white rounded overflow-x-auto'
      >
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 30 }}
          barCategoryGap={"10%"}
        >
          <CartesianGrid
            stroke='#ccc'
            strokeDasharray='0'
            vertical={false}
            horizontalPoints={horizontalPoints}
          />
          <XAxis
            dataKey='date'
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: "12px" }}
            tickMargin={15.5}
          />
          <YAxis
            ticks={yAxisTicks}
            domain={[0, maxTick]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: "12px" }}
            tickMargin={16}
          />
          <Tooltip cursor={{ fill: "#eee", opacity: 0.75 }} />
          <Bar dataKey='value' fill='#f7931a' barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
