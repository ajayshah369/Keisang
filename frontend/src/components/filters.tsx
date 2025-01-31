import { ChevronLeft, Cancel } from "@mui/icons-material";
import { useState } from "react";
import { FormControlLabel, Checkbox, Button } from "@mui/material";

import useApi from "../hooks";

const Filters = () => {
  const {
    closeFilters,
    brands,
    setSelectedBrands: setSelectedBrandsContext,
    setSelectedDurations: setSelectedDurationsContext,
  } = useApi();

  const [durations] = useState<string[]>([
    "last_month",
    "this_month",
    "last_3_months",
    "last_6_months",
    "this_year",
    "last_year",
  ]);

  const [selectedBrands, setSelectedBrands] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedDurations, setSelectedDurations] = useState<
    Record<string, boolean>
  >({});

  return (
    <div
      className='max-w-96 w-full h-full overflow-auto bg-white px-4 py-6 flex flex-col items-stretch gap-6'
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className='flex items-center gap-2 border-b pb-3 cursor-pointer'
        style={{
          borderColor: "#d2d2d2",
        }}
        onClick={closeFilters}
      >
        <ChevronLeft fontSize={"small"} className='text-gray-500' />
        <h1 className='text-xl font-medium'>Filter Data By</h1>
      </div>

      <div
        className='border-b pb-3'
        style={{
          borderColor: "#d2d2d2",
        }}
      >
        <h2 className='text-base font-medium'>Make</h2>

        <div className='flex flex-col mt-2'>
          {brands.map((brand) => (
            <div key={brand} className='flex items-center gap-2'>
              <FormControlLabel
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "0.75rem" },
                  margin: 0,
                }}
                control={
                  <Checkbox
                    size='small'
                    checked={!!selectedBrands[brand]}
                    onChange={(e) => {
                      setSelectedBrands((prev) => {
                        const data = { ...prev };

                        if (e.target.checked) {
                          data[brand] = true;
                        } else {
                          delete data[brand];
                        }

                        return data;
                      });
                    }}
                  />
                }
                label={brand.titleCase()}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className='border-b pb-3'
        style={{
          borderColor: "#d2d2d2",
        }}
      >
        <h2 className='text-base font-medium'>Duration</h2>

        <div className='flex flex-col mt-2'>
          {durations.map((duration) => (
            <div key={duration} className='flex items-center gap-2'>
              <FormControlLabel
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "0.75rem" },
                  margin: 0,
                }}
                control={
                  <Checkbox
                    size='small'
                    checked={!!selectedDurations[duration]}
                    onChange={(e) => {
                      setSelectedDurations((prev) => {
                        const data = { ...prev };

                        if (e.target.checked) {
                          data[duration] = true;
                        } else {
                          delete data[duration];
                        }

                        return data;
                      });
                    }}
                  />
                }
                label={duration
                  .split("_")
                  .map((e) => e.titleCase())
                  .join(" ")}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <Button
          variant='contained'
          color='warning'
          size='small'
          className='flex-1'
          sx={{ fontSize: "0.75rem" }}
          onClick={() => {
            setSelectedBrandsContext(selectedBrands);
            setSelectedDurationsContext(selectedDurations);
            closeFilters();
          }}
        >
          Apply Filters
        </Button>

        <Button
          variant='outlined'
          color='warning'
          size='small'
          className='flex-1'
          startIcon={<Cancel fontSize='small' />}
          sx={{ fontSize: "0.75rem" }}
          onClick={() => {
            setSelectedBrands({});
            setSelectedDurations({});
            setSelectedBrandsContext({});
            setSelectedDurationsContext({});
            closeFilters();
          }}
        >
          Remove All Filters
        </Button>
      </div>
    </div>
  );
};

export default Filters;
