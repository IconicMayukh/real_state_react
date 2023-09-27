import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { db } from '../firebase'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import { useParams } from 'react-router'


const Category = () => {

    const params = useParams()

  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchListing, setLastFetchListing] = useState(null)

  useEffect(() => {
    async function fetchListings(){
      try {
        const listingRef = collection(db,"listings")
        const q = query(listingRef, where("type","==",params.categoryName), orderBy("timestamp", "desc"), limit(8))

        const querySnap =await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length-1]
        setLastFetchListing(lastVisible)
        // console.log(lastVisible)
        let listingArr = []
        querySnap.forEach((listing)=>{
          return listingArr.push({
            id:listing.id,
            data: listing.data(),
          })
        })
        setListings(listingArr)
        setLoading(false) 

      } catch (error) {
        toast.error("Could not load more offers!")
      }
    }
    fetchListings()
  }, [])



  async function fetchMoreListings(){
    try {
      const listingRef = collection(db,"listings")
      const q = query(listingRef, where("type","==",params.categoryName), orderBy("timestamp", "desc"), startAfter(lastFetchListing), limit(4))

      const querySnap =await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length-1]
      setLastFetchListing(lastVisible)
      let listingArr = []
      querySnap.forEach((listing)=>{
        return listingArr.push({
          id:listing.id,
          data: listing.data(),
        })
      })
      setListings((prevState)=>[
        ...prevState, ...listingArr
      ])
      setLoading(false) 

    } catch (error) {
      toast.error("Could not load more offers!")
    }
  }

  if(loading) return <Spinner/>
  
  return (
    <div className='max-w-[90%] mx-auto pt-4 space-y-6'>
      {listings.length === 0 && (
        <h2 className='px-3 text-xl mt-2 font-semibold'>Sorry there are no properties for {params.categoryName} at this moment!</h2>
      )}
        {listings && listings.length > 0 && (
          <div className='mb-6'>
            <h2 className='px-3 text-2xl mt-2 mb-2 font-semibold text-center'>Properties for {params.categoryName}</h2>
            {/* <Link to={"/category/sale"}>
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out hover:underline cursor-pointer'>Show more properties for sale</p>
            </Link> */}
            <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
              {listings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}></ListingItem>
              ))}
            </ul>
          </div>
        )}
        {lastFetchListing && (
          <div className='w-full flex justify-center items-center'>
            <button className='bg-white px-3 py-1 text-gray-700 border border-gray-300 my-6 hover:border-slate-600 rounded-md transition duration-150 ease-in-out' onClick={fetchMoreListings}>Load more</button>
          </div>
        )}
      </div>
  )
}

export default Category
