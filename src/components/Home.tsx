import { useContext, useEffect, useState } from "react"
import log from "loglevel";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import { IPOStatusResp, UserInfoResp } from "../common/types";
import axios from "axios";

export const IpoChecker = () => {
    const userData = sessionStorage.getItem('userData');
    const [pans, setPans] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [tableLoading, setTableLoading] = useState(false)
    const [panLoadingStatuses, setPanLoadingStatuses] = useState<Record<string, boolean>>({});
    const [panStatuses, setPanStatuses] = useState<Record<string, string>>({});

    const handleCompanySelect = async (companyName: string) => {
        setSelectedCompany(companyName);
    };

    useEffect(() => {
        if (!userData) {
            setError("No PAN number found. Please login again.");
            log.error("Error getting panNo from Login");
            return;
        }

        try {
            log.info("received user data : ", userData);
            const parsedPans = (JSON.parse(userData) as UserInfoResp).pan_numbers;
            setPans(parsedPans);
            log.info("Pan numbers received: ", parsedPans);
        } catch (e) {
            setError("Invalid PAN data format");
            log.error("Error parsing PAN numbers:", e);
        }
    }, [userData]);

    useEffect(() => 
        {
            if (error) {
                log.error("Bad Request")
                setTableLoading(false)
                toast.error("Try again", {
                    position: "top-right",
                    autoClose: 3000,
                })
            return;
        }
    }, [error])

    const getPanStatus = async (panNo: string) => {
        log.info("getting status for pan : ", panNo)
        try {
            const resp = await axios.post("http://localhost:9000/get-ipo-status", {
                ipo_name: selectedCompany,
                pan_number: panNo
            })
    
            if(resp.status !== 202) {
                log.error("Bad Request")
                toast.error("Try again", {
                    position: "top-right",
                    autoClose: 3000,
                })
                setTableLoading(false)
                return
            }
            log.info("The response received: ", resp.data)

            const ipoStatusResp: IPOStatusResp = resp.data.data as IPOStatusResp

            if (!ipoStatusResp.is_applied){
                updatePanStatus(panNo, "Not Applied")
                updatePanLoadingStatus(panNo, false)
                return
            }

            if(!ipoStatusResp.is_alloted){
                updatePanStatus(panNo, "Not Alloted")
                updatePanLoadingStatus(panNo, false)
                return
            }

            updatePanStatus(panNo, "Alloted "+ipoStatusResp.securities_alloted)
            updatePanLoadingStatus(panNo, false)
            return
        } catch(e) {
            log.error("Inside catch", e)
            
            toast.error("Try again", {
                position: "top-right",
                autoClose: 3000,
            })
            setTableLoading(false)
        }
    }

    const updatePanLoadingStatus = (pan: string, status: boolean) => {
        setPanLoadingStatuses((prevStatuses) => ({
            ...prevStatuses,
            [pan]: status,
        }));
    };

    const updatePanStatus = (pan: string, status: string) => {
        setPanStatuses((prevStatuses) => ({
            ...prevStatuses,
            [pan]: status,
        }));
    };

    const handleSubmit = async () => {

        log.info("Looking for pan statuses")

        const loadingStatus: Record<string, boolean> = {}

        pans.forEach((val) => {
            loadingStatus[val] = true
        })
        setPanLoadingStatuses(loadingStatus)

        setTableLoading(true)

        for(const val of pans) {
            await getPanStatus(val)
            log.info("Setting a delay of 3 seconds")
            await new Promise(resolve => setTimeout(resolve, 3000))
            log.info("delay is done")
        }
    }

    return (
        <>
            <div className="flex justify-center items-start h-20">
                <h1 className="align-center mx-auto my-auto">
                    Select the IPO
                </h1>
            </div>
            <div className="flex justify-center items-center h-30 dropdown">
                <button className="btn btn-secondary dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {selectedCompany || 'Select Company'}  
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('CapitalNumbers Infotech Limited - SME IPO');
                        }}>
                            CapitalNumbers Infotech Limited
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('Rikhav Securities Limited - SME IPO');
                        }}>
                            Rikhav Securities Limited - SME IPO
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('CHAMUNDA ELECTRICAL LIMITED');
                        }}>
                            CHAMUNDA ELECTRICAL LIMITED
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('DR AGARWALS HEALTH CARE LIMITED');
                        }}>
                            DR AGARWALS HEALTH CARE LIMITED
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('MUTHOOT MERCANTILE LTD NCDS  TRANCHE IV ');
                        }}>
                            MUTHOOT MERCANTILE LTD NCDS  TRANCHE IV 
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('EDELWEISS FINANCIAL SERVICES LIMITED NCD JAN 2025');
                        }}>
                            EDELWEISS FINANCIAL SERVICES LIMITED NCD JAN 2025
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('LANDMARK IMMIGRATION CONSULTANTS LIMITED');
                        }}>
                            LANDMARK IMMIGRATION CONSULTANTS LIMITED
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('CHEMMANUR CREDITS AND INVESTMENTS LIMITED');
                        }}>
                            CHEMMANUR CREDITS AND INVESTMENTS LIMITED
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleCompanySelect('CAPITAL INFRA TRUST INVIT');
                        }}>
                            CAPITAL INFRA TRUST INVIT
                        </a>
                    </li>
                </ul>
                
            </div>
            <div className="flex items-center justify-center h-10">
                <button type="button" className="block bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-black" onClick={handleSubmit}>
                    GET STATUS
                </button>
            </div>
            {tableLoading && 
            <div className="card flex items-center justify-center my-20 mx-30">
                
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center text-lg">PAN Number</th>
                                <th scope="col" className="text-center text-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pans.map((pan, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="text-center text-lg" >
                                                {pan}
                                            </td>
                                            <td className="text-center text-lg">
                                                {
                                                    panLoadingStatuses[pan]?  
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> 
                                                    :
                                                    <div>
                                                        {panStatuses[pan]}
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                
            </div>}
            
            <ToastContainer/>
        </>
    )
}