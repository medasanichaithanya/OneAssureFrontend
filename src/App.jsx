import React, { useState } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const [adultCount, setAdultCount] = useState(0);
  const [adultAges, setAdultAges] = useState(['', '']);
  const [childCount, setChildCount] = useState(0);
  const [childAges, setChildAges] = useState(['', '', '','']);
  const [cityTier,setCityTire] = useState('');
  const [cover, setCover] = useState('');
  const [tenure, setTenure] = useState('');
  const [open, setOpen] = useState(false);
  const [baseRates, setBaseRates] = useState([]);
  const [floaterDiscount, setFloaterDiscount] = useState([]);
  const [discountRate, setDiscountRate] = useState([]);
  const [total, setTotal] = useState(0);
  const [combination, setCombination] = useState([]);
  const [submit,setSubmit] = useState(false);

  const handleAdultCount = (e) => {
    const adultValue = parseInt(e.target.value, 10);
    setAdultCount(adultValue)
    setAdultAges(adultValue === 1 ? ['']  : ['', '']);
  };

  const handleAdultAges = (index, value) => {
    const updatedAdultAges = [...adultAges];
    updatedAdultAges[index] = value;
    setAdultAges(updatedAdultAges);
  };

  const handleChildCount = (e) => {
    const childValue = parseInt(e.target.value, 10);
    setChildCount(childValue)
    setChildAges(childValue === 1 ? [''] : childValue === 2 ? ['', ''] : childValue === 3 ? ['', '', ''] : ['','','','']);
  };

  const handleChildAges = (index, value) => {
    const updatedChildAges = [...childAges];
    updatedChildAges[index] = value;
    setChildAges(updatedChildAges);
  };

  const handleCityTier = (e) => {
    setCityTire(e.target.value)
  };

  const handleTenure = (e) => {
    setTenure(e.target.value)
  };

  const handleCover = (e) => {
    setCover(parseInt(e.target.value))
  };

  const data_to_backend = {
    cover : cover,
    tier : cityTier,
    adult_ages : adultAges.join(','),
    child_ages : childAges.join(','),
    premium_comb : adultCount + 'a,' + childCount + 'c',
    tenure : tenure
  };

  const handleSubmit = (event) => {
    setOpen(true);
    event.preventDefault()
     axios.get('https://onse-assure-backend-uoiz.vercel.app/fetch-premium',
    //  axios.get('http://127.0.0.1:5000/fetch-premium',
    {
      params: data_to_backend,
    })
    .then((response) => {
      const data = response.data;
      if (data.status === 'SUCCESS'){
        setBaseRates(data.baseRates)
        setFloaterDiscount(data.floaterDiscount)
        setDiscountRate(data.discountRate)
        setTotal(data.total)
        setSubmit(true)
        const combination = generateLabels( adultCount + 'a,' + childCount + 'c')
        setCombination(combination)
      }  
      })
    .catch((error) => console.log(error));
  };

  const handleToClose = () => {
    setOpen(false);
    setSubmit(true);
  };

  const generateLabels = (value) => {
    const labels = [];
    const parts = value.split(',');
    for (const part of parts) {
      const [count, type] = part.split('');
      for (let i = 1; i <= count; i++) {
          if (type === 'a'){
            const type = "Adult "
              labels.push(`${type}${i}`);
          }
          else {
              const type = "Children "
              labels.push(`${type}${i}`);       
          }  
      }
    }

    return labels;
  }

  return (
    <>
      <div className = "d-flex justify-content-center vw-100 ">
        <form className = "text-dark  mt-4 shadow-lg p-5 mb-4 bg-white rounded" onSubmit={handleSubmit}>
            <div className='text-center'>
              <img src="https://static.wixstatic.com/media/0fd5af_7e536c9b5c264f2483c076066e40ce56~mv2.png/v1/fill/w_150,h_36,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Logo.png" alt="logo"  width="40%"/>
            </div>
            <h2 className='mt-5 mb-3 text-center'> Health Insurance Plan Generator</h2>
            <p>Select the number of adults in your family:</p>
            <select className = "form-select mb-2" aria-label = "Default select example" value={adultCount} onChange={handleAdultCount} required>
              <option selected value="">Select Count of Adults</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            { adultCount ? (adultAges.map((value, index) => (
              <>
                <p>Enter the Ages of adults in your family:</p>
                <input
                    key={index}
                    type="text"
                    value={value}
                    className="form-control mb-2" 
                    onChange={(e) => handleAdultAges(index, e.target.value)}
                    placeholder={`Enter Age of Adult ${index + 1}`}
                    required
                  />
              </>  ))):null
            }
            <p>Select the numbers of child in your family:</p>
            <select className="form-select mb-2" aria-label="Default select example"  value={childCount} onChange={handleChildCount} required>
              <option selected value=''>Select Count of Childrens</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            { childCount ? (
              (childAges.map((values, indexs) => (
                <>
                  <p>Enter the Ages of child in your family:</p>
                  <input
                    key={indexs}
                    type="text"
                    value={values}
                    className="form-control mb-2" 
                    onChange={(e) => handleChildAges(indexs, e.target.value)}
                    placeholder={`Enter Age of child ${indexs + 1}`}
                    required
                  />
                </>)))):null
            }
            <p>Select the City Tier:</p>
            <select className="form-select mb-2" aria-label="Default select example" value={cityTier} onChange={handleCityTier} required >
              <option selected value=''>Select the Tier</option>
              <option value="tier-1">Tier-1</option>
              <option value="tier-2">Tier-2</option>
              <option value="tier-3">Tier-3</option>
            </select>
            <p>Select the Tenure:</p>
            <select className="form-select mb-2" aria-label="Default select example"  value={tenure} onChange={handleTenure} required >
              <option selected value=''>Select the Tenure</option>
              <option value="1-year">1-Year</option>
              <option value="2-year">2-Year</option>
            </select>
            <p>Select the Cover:</p>
            <select className="form-select mb-2" aria-label="Default select example" value={cover} onChange={handleCover} required>
              <option selected value=''>Select Cover Range</option>
              <option value="500000">500000</option>
              <option value="700000">700000</option>
              <option value="1000000">1000000</option>
              <option value="1500000">1500000</option>
              <option value="2000000">2000000</option>
              <option value="2500000">2500000</option>
              <option value="3000000">3000000</option>
              <option value="4000000">4000000</option>
              <option value="5000000">5000000</option>
              <option value="16000000">6000000</option>
              <option value="17500000">7500000</option>
            </select>
            <div className='text-center'>
            <button type="submit" className="btn btn-primary btn-lg mt-3" >Checkout</button>
            </div>
        </form> 
      </div>
      <Dialog open={open} onClose={handleToClose}>
          <DialogTitle>{"Here is your Insurance Pan"}</DialogTitle>
          <DialogContent>
              <DialogContentText>
  
                { submit ? (
                   <div>
                     <table className="table table-bordered p-2">
                     <thead>
                       <tr className="table-active">
                         <th scope="col"></th>
                         {combination.map((value,index) => (
                              <th scope="col" key={index}>{value}</th>
                         ))}
                       </tr>
                     </thead>
                     <tbody>
                       <tr>
                         <th scope="row">Base Rate</th>
                         {baseRates.map((value, index) => (
                           <td key={index}>{value}</td>
                         ))}
                       </tr>
                       <tr>
                         <th scope="row">Floater Discount</th>
                         {floaterDiscount.map((value, index) => (
                             <td key={index}>{value}%</td>
                         ))}
                       </tr>
                       <tr>
                         <th scope="row">Discounted Rate</th>
                         {discountRate.map((value,index) => (
                           <td key={index}>{value}</td>
                         ))}
                       </tr>
                       <tr>
                       <th scope="row">Total</th>
                       <td>{total}</td>
                       </tr>
                     </tbody>
                   </table>
                   </div>
                ):(
                  <div className="progress h-40" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" >
                       <div className="progress-bar progress-bar-striped progress-bar-animated w-100">Please Wait! You Plan is fetching....</div>
                  </div>
                    )}
               
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <button onClick={handleToClose}
                  className="btn btn-primary btn-lg">
                  Close
              </button>
          </DialogActions>
      </Dialog>
      
    </>
  )
}

export default App
