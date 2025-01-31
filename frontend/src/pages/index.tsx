import { useEffect, useState } from "react";

import { ApiContext } from "../hooks";

import Head from "../components/head";
import Summary from "../components/summary";
import BarGraph from "../components/barGraphData";
import HistoryLog from "../components/historyLog";
import Filters from "../components/filters";
import { Backdrop } from "@mui/material";
import axiosInstance from "../utilities/axiosInstance";

const Home = () => {
  const [selectedDealer, setSelectedDealer] = useState<string>("");
  const [dealers, setDealers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [brands, setBrands] = useState<string[]>([]);

  const [selectedBrands, setSelectedBrands] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedDurations, setSelectedDurations] = useState<
    Record<string, boolean>
  >({});

  const closeFilters = () => {
    setShowFilters(false);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const selectDealer = (dealer: string) => {
    setSelectedDealer(dealer);
  };

  const getAllDealers = async () => {
    axiosInstance
      .get("/admin/vehicles/dealers")
      .then((res) => {
        setDealers(res.data.data);
      })
      .catch(() => {});
  };

  const getAllBrands = async () => {
    axiosInstance
      .get("/admin/vehicles/brands")
      .then((res) => {
        setBrands(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getAllDealers();
    getAllBrands();
  }, []);

  return (
    <main className='px-2 md:px-4 xl:p-8 py-4 flex flex-col items-stretch gap-6'>
      <ApiContext.Provider
        value={{
          selectedDealer,
          selectDealer,
          dealers,
          showFilters,
          toggleFilters,
          closeFilters,
          brands,
          selectedBrands,
          selectedDurations,
          setSelectedBrands,
          setSelectedDurations,
        }}
      >
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showFilters}
          onClick={() => closeFilters()}
          className='justify-end!'
        >
          <Filters />
        </Backdrop>

        <Head />
        <Summary />
        <BarGraph endpoint='inventory-graph-data' title='Inventory Count' />
        <BarGraph
          endpoint='average-msrp-graph-data'
          title='Average MSRP in USD'
        />
        <HistoryLog />
      </ApiContext.Provider>
    </main>
  );
};

export default Home;
