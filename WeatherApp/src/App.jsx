import React from 'react'
import './App.css'
import { useState,useEffect } from 'react'
import axios from 'axios'
import {IoMdSearch} from 'react-icons/io'
import {BsEye,BsWater,BsThermometer,BsWind} from 'react-icons/bs'
import {TbTemperatureCelsius} from 'react-icons/tb'
import {ImSpinner8} from 'react-icons/im'


const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY

function App() {
  const [data,setData] = useState(null)
  const [location,setLocation] = useState('Jodhpur')
  const [inputValue,setInputValue] = useState('')
  const [animation,setAnimation] = useState(false)
  const [loading,setLoading] = useState(false)
  const [errorMsg,setErrorMsg] = useState('');
  const [time,setTime] = useState(new Date());
  const handleInput = (e)=>{
    setInputValue(e.target.value)
  }

  const handleSubmit = (e)=>{
    
    // if input value is not empty
    if(inputValue!==''){
      //set location
      setLocation(inputValue);
    }
    //select input
    const input = document.querySelector('input')
    // if input value is empty
    if(input.value===''){
      setAnimation(true)
      //after 500ms make it false
      setTimeout(()=>{
        setAnimation(false)
      },500)
    }


    input.value = '';
    //prevent defaults
    e.preventDefault();
  }

  useEffect(()=>{
    setLoading(true);
    (async()=>{
      try {
         await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`).then((res)=>{
          setTimeout(()=>{
            setData(res.data);
           
            setLoading(false);
          },1500)
        })
      } catch (error) {
        setLoading(false)
        setErrorMsg(error)
      }
    })();
  },[location]);

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setErrorMsg('')
    },2000)
    //clear timer

    return () => clearTimeout(timer);
  },[errorMsg])


  useEffect(()=>{
    const interval = setInterval(()=>{
      setTime(new Date());
    },1000)

    return ()=> clearInterval(interval);
  },[]);
 // Time Formate
  const formatTime = (num) => String(num).padStart(2, "0");
  const hours = time.getHours()%12 || 12;
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());
  const ampm = time.getHours()>=12 ? "PM" : "AM"
//If There is no data
  if(!data){
    return(
    <div className='h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-800 bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center'>
      <div>
        <ImSpinner8 className="text-5xl animate-spin text-white"/>
      </div>
    </div>
    )
  }

//


  const date = new Date()
 
  return (
    <>
    <div className='w-full h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-800 bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0'>
      {errorMsg ?(<div className='w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-8 p-4 capitalize rounded-md text-center'>{errorMsg.response.data.message}</div>):(
      <form className={`${animation? 'animate-bounce' : 'animate-none'} h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}>
        <div className='h-full relative flex items-center justify-between p-2'>
          <input onChange={(e)=>handleInput(e)}
          className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full'
          type="text"
          placeholder='Search by city or country'/>
          <button onClick={(e)=>handleSubmit(e)} className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition'>
            <IoMdSearch className='text-2xl text-white'/>
          </button>
        </div>
      </form>)}
      <div className='w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6'>
      {loading ? (
        <div className='w-full h-full flex justify-center items-center'>
        <ImSpinner8 className='text-white text-5xl animate-spin'/>
        </div>
      ):(
        <div>
          {/* card top */}
          <div className='flex items-center gap-x-5'>
            <div className='text-[87px]'>
              <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="" />
            </div>
            <div>
              {/* country name */}
              <div className='text-2xl font-semibold'>
                {data.name},{data.sys.country}
              </div>
              {/* date */}
              <div>
                
                {date.toDateString()}
                <br/>
                {formatTime(hours)}:{minutes}:{seconds} {ampm}
              </div>
            </div>
          </div>
          {/* card body */}
          <div className='my-20'>
            <div className='flex justify-center items-center'>
              {/* temp */}
              <div className='text-[138px] leading-none font-light'>
                {parseInt(data.main.temp)}
              </div>
              <div className='text-4xl'>
                <TbTemperatureCelsius/>
              </div>
            </div>
            {/* weather description */}
            <div className='capitalize text-center'>{data.weather[0].description}</div>
          </div>
          {/* card bottom */}
          <div className='max-w-[378px] mx-auto flex flex-col gap-y-6'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-x-2'>
                {/* icons */}
                <div className='text-[20px]'>
                  <BsEye/>
                </div>
                <div>
                  Visibility{' '}<span className='ml-2'>{data.visibility / 1000} km</span>
                </div>
              </div>
              <div className='flex items-center gap-x-2'>
                {/* icons */}
                <div className='text-[20px]'>
                  <BsThermometer/>
                </div>
                <div className='flex'>
                  Feels like
                  <div className='flex ml-2'>
                    {parseInt(data.main.feels_like)}
                    <TbTemperatureCelsius/>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center gap-x-2'>
                {/* icons */}
                <div className='text-[20px]'>
                  <BsWater/>
                </div>
                <div>
                  Humidity<span className='ml-2'>{data.main.humidity} %</span>
                </div>
              </div>
              <div className='flex items-center gap-x-2'>
                {/* icons */}
                <div className='text-[20px]'>
                  <BsWind/>
                </div>
                <div >
                  Wind
                  <span className='ml-2'>
                    {data.wind.speed} m/s
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>)}
      </div>
    </div>
    </>
  )
}

export default App
