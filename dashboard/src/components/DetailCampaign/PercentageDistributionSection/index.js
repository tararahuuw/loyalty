import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const PercentageDistributionSection = ({
    mostGeneratedTitle = [],
    mostGeneratedDistribution = [],
    mostRedeemedTitle = [],
    mostRedeemedDistribution = []
}) => {
    const colorChart = [
        '#023773',
        '#034EA2',
        '#5688FB',
        '#9EBAFD',
        '#EAF0FF',
        '#ECECEC',
        '#C4C4C4',
        '#9B9B9C',
        '#49494A'
    ]

    const dataGeneratedDistribution = {
        datasets: [
          {
            data: mostGeneratedDistribution,
            labels: mostGeneratedTitle,
            backgroundColor: colorChart,
            hoverOffset: 4,
            borderRadius: 8,
            offset: 16,
          },
        ],
    };

    const dataRedeemedDistribution = {
        datasets: [
          {
            data: mostRedeemedDistribution,
            labels: mostRedeemedTitle,
            backgroundColor: colorChart,
            hoverOffset: 4,
            borderRadius: 8,
            offset: 16,
          },
        ],
    };
    
    const options = {
        plugins: {
            tooltip: {
                enabled: true,
            },
        },
        cutout: '60%',
    };
  return (
    <div className='bg-white rounded-lg py-5 px-6 shadow-md w-full'>
        <p className='font-semibold text-black text-lg'>Best Selling Product - Percentage Distribution</p>
        <hr className='text-neutral30'/>
        <div class="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="shadow-md p-3 rounded-md py-3 px-6">
                <p className="font-bold text-md">Most Generated</p>
                <div className="flex justify-center items-center w-full">
                    <div className="relative w-1/2">
                        <Doughnut data={dataGeneratedDistribution} options={options} />
                        <div className="absolute inset-0 flex items-center justify-center mt-4">
                            <div className="text-center">
                                {
                                    mostGeneratedTitle.length > 0 && mostGeneratedDistribution.length > 0 ?
                                    <>
                                        <p className="text-xl font-bold">100%</p>
                                        <p className="text-md text-neutral300">Data Recorded</p>
                                    </>
                                    :
                                    <p className="text-xl font-bold">No Data Available</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    {
                        mostGeneratedDistribution.map((value, index) => 
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 mr-2 rounded-full" style={{backgroundColor:colorChart[index]}}></div>
                                    <p className="text-neutral300 text-sm">{mostGeneratedTitle[index]}</p>
                                </div>
                                <p className="text-sm font-bold">{value}%</p>
                            </div> 
                        )
                    }
                </div>
            </div>
            <div className="shadow-md p-3 rounded-md py-3 px-6">
                <p className="font-bold text-md">Most Redeemed</p>
                <div className="flex justify-center items-center w-full">
                    <div className="relative w-1/2">
                        <Doughnut data={dataRedeemedDistribution} options={options} />
                        <div className="absolute inset-0 flex items-center justify-center mt-4">
                            <div className="text-center">
                                {
                                    mostRedeemedTitle.length > 0 && mostRedeemedDistribution.length > 0 ?
                                    <>
                                        <p className="text-xl font-bold">100%</p>
                                        <p className="text-md text-neutral300">Data Recorded</p>
                                    </>
                                    :
                                    <p className="text-xl font-bold">No Data Available</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    {
                        mostRedeemedDistribution.map((value, index) => 
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 mr-2 rounded-full" style={{backgroundColor:colorChart[index]}}></div>
                                    <p className="text-neutral300 text-sm">{mostRedeemedTitle[index]}</p>
                                </div>
                                <p className="text-sm font-bold">{value}%</p>
                            </div> 
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default PercentageDistributionSection