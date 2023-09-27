import React, { useEffect, useState } from 'react'
import SliderHome from '../components/SliderHome'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import ListingItem from '../components/ListingItem'
import { Link } from 'react-router-dom'


const Home = () => {

  // offers ---> those only having discount :D
  const [offerListing, setOfferListing] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings")
        const q = query(listingRef, where("discount", "==", true), orderBy("timestamp", "desc"), limit(4))
        const querySnap = await getDocs(q);

        const listingArr = []
        querySnap.forEach((doc) => {
          return listingArr.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setOfferListing(listingArr)

      } catch (error) {
        console.log(error.message)
      }
    }
    fetchListings()
  }, [])

  // rent ---> type == rent
  const [rentListings, setRentListings] = useState(null)
  useEffect(() => {
    async function fetchRentListings() {
      try {
        const listingRef = collection(db, "listings")
        const q = query(listingRef, where("type", "==", "rent"), orderBy("timestamp", "desc"), limit(4))
        const querySnap = await getDocs(q);

        const listingArr = []
        querySnap.forEach((doc) => {
          return listingArr.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setRentListings(listingArr)

      } catch (error) {
        console.log(error.message)
      }
    }
    fetchRentListings()
  }, [])


  // rent ---> type == rent
  const [saleListings, setSaleListings] = useState(null)
  useEffect(() => {
    async function fetchSaleListings() {
      try {
        const listingRef = collection(db, "listings")
        const q = query(listingRef, where("type", "==", "sale"), orderBy("timestamp", "desc"), limit(4))
        const querySnap = await getDocs(q);

        const listingArr = []
        querySnap.forEach((doc) => {
          return listingArr.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setSaleListings(listingArr)

      } catch (error) {
        console.log(error.message)
      }
    }
    fetchSaleListings()
  }, [])

  return (
    <>
      <SliderHome></SliderHome>
      <div className='max-w-[90%] mx-auto pt-4 space-y-6 grid'>
        {offerListing && offerListing.length > 0 && (
          <div className='mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Recent Offers</h2>
            <Link to={"/offers"}>
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out hover:underline cursor-pointer'>Show more offers</p>
            </Link>
            <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
              {offerListing.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}></ListingItem>
              ))}
            </ul>
          </div>
        )}
      </div>


      <div className='max-w-[90%] mx-auto pt-4 space-y-6'>
        {rentListings && rentListings.length > 0 && (
          <div className='mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Properties for rent</h2>
            <Link to={"/category/rent"}>
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out hover:underline cursor-pointer'>Show more properties for rent</p>
            </Link>
            <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
              {rentListings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}></ListingItem>
              ))}
            </ul>
          </div>
        )}
      </div>


      <div className='max-w-[90%] mx-auto pt-4 space-y-6'>
        {saleListings && saleListings.length > 0 && (
          <div className='mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Properties for Sale</h2>
            <Link to={"/category/sale"}>
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out hover:underline cursor-pointer'>Show more properties for sale</p>
            </Link>
            <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
              {saleListings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}></ListingItem>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default Home
