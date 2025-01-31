import { Button, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";
import CustomBarChart from "./customerBarchart";
import axiosInstance from "../utilities/axiosInstance";
import { DataType } from "./customerBarchart";
import useApi from "../hooks";

const TypeButton = ({
  type,
  selected,
  setSelected,
  disabled,
}: {
  type: string;
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}) => {
  return (
    <Button
      variant={selected === type ? "contained" : "outlined"}
      size='small'
      color='warning'
      sx={{
        fontStyle: {
          color: selected === type ? "#fff" : "#000",
        },
        width: 32,
        height: 36,
      }}
      onClick={() => setSelected(type)}
      className='font-normal!'
      disabled={disabled}
    >
      {type.toUpperCase()}
    </Button>
  );
};

const BarGraph = ({ endpoint, title }: { endpoint: string; title: string }) => {
  const { selectedDealer, selectedBrands, selectedDurations } = useApi();
  const [types] = useState(["new", "used", "cpo"]);
  const [selected, setSelected] = useState<string>("new");

  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = () => {
    setLoading(true);

    axiosInstance
      .get<{ data: DataType }>("/admin/vehicles/" + endpoint, {
        params: {
          condition: selected,
          dealer: selectedDealer,
          brands: Object.keys(selectedBrands),
          durations: Object.keys(selectedDurations),
        },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, selected, selectedDealer, selectedBrands, selectedDurations]);

  if (loading || !data) {
    return <Skeleton variant='rectangular' height={300} className='rounded' />;
  }

  return (
    <div className=''>
      <div className='flex items-center gap-3 mb-4'>
        <p className='text-xs font-semibold'>{title}</p>

        {types.map((type) => (
          <TypeButton
            key={type}
            type={type}
            selected={selected}
            setSelected={setSelected}
            disabled={loading}
          />
        ))}
      </div>

      <CustomBarChart data={data} />
    </div>
  );
};

export default BarGraph;
