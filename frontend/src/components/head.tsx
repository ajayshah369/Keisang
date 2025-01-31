import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import useApi from "../hooks";

const Head = () => {
  const { dealers, selectedDealer, selectDealer, toggleFilters } = useApi();

  return (
    <div
      className='flex items-center justify-between border-b pb-3'
      style={{
        borderColor: "#d2d2d2",
      }}
    >
      <h1 className='text-2xl font-medium'>Inventory</h1>

      <div className='flex items-center gap-3'>
        <p className='font-semibold'>Select Dealer</p>
        <FormControl sx={{ minWidth: 200 }} size='small' color='warning'>
          {!selectedDealer && (
            <InputLabel
              id='select-dealer-label'
              shrink={false}
              className={selectedDealer ? "hidden" : ""}
            >
              Select Dealer
            </InputLabel>
          )}
          <Select
            labelId='select-dealer-label'
            id='select-dealer'
            value={selectedDealer}
            onChange={(e) => {
              selectDealer(e.target.value as string);
            }}
            size='small'
          >
            {dealers.map((dealer, index) => (
              <MenuItem key={dealer + index} value={dealer}>
                {dealer}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div
          className='bg-white rounded py-2 px-4 flex items-center gap-2 cursor-pointer'
          onClick={toggleFilters}
        >
          <FilterList color='warning' />
          <p className='text-sm font-medium'>FILTER DATA BY</p>
        </div>
      </div>
    </div>
  );
};

export default Head;
