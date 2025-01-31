import { Skeleton, Typography } from "@mui/material";
import axiosInstance from "../utilities/axiosInstance";
import { Fragment, useEffect, useState } from "react";

import useApi from "../hooks";

type DataType = {
  recentTimestamp: string;
  summary: {
    condition: string;
    count: number;
    msrp: number;
    avg_msrp: number;
  }[];
};

type DataBoxProps = {
  condition: string;
  title: string;
  value: number;
  count?: boolean;
  amount?: boolean;
};

const DataBox = (props: DataBoxProps) => {
  const { condition, title, value, count, amount } = props;

  return (
    <div className='bg-white p-4 shadow-md rounded flex flex-col gap-1'>
      <Typography variant='h2' className='text-xl! font-medium!'>
        {amount ? "$" : ""}
        {value.toLocaleString("en-US")}
      </Typography>
      <Typography
        variant='h6'
        color='warning'
        className='text-xs! font-medium!'
      >
        {count ? "# " : ""}
        {condition.titleCase()} {title}
      </Typography>
    </div>
  );
};

const Summary = () => {
  const { selectedDealer, selectedBrands, selectedDurations } = useApi();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataType | null>(null);

  const fetchData = async () => {
    setLoading(true);

    axiosInstance
      .get<{ data: DataType }>("/admin/vehicles/summary", {
        params: {
          dealer: selectedDealer,
          brands: Object.keys(selectedBrands),
          durations: Object.keys(selectedDurations),
        },
      })
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedDealer, selectedBrands, selectedDurations]);

  if (loading || !data) {
    return <Skeleton variant='rectangular' height={100} className='rounded' />;
  }

  return (
    <div>
      <p className='text-xs font-semibold mb-3'>
        Recent Gathered Data {data.recentTimestamp}
      </p>

      <div
        className='gap-4 grid grid-flow-row
        grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9'
      >
        {data.summary.map((item, index) => (
          <Fragment key={item.condition + index}>
            <DataBox
              condition={item.condition}
              title='Units'
              value={item.count}
              count
            />
            <DataBox
              condition={item.condition}
              title='MSRP'
              value={item.msrp}
              amount
            />
            <DataBox
              condition={item.condition}
              title='Avg. MSRP'
              value={item.avg_msrp}
              amount
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Summary;
