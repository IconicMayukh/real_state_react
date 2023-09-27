import React from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { MdLocationOn , MdEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa"

export default function ListingItem({ listing, id, onDelete, onEdit }) {
    return (
        <li className='relative bg-white flex justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 my-4'>
            <Link to={`/category/${listing.type}/${id}`}>
                <img src={listing.imgUrls[0]} alt={listing.name} className='w-full object-contain hover:scale-105 transition duration-150 ease-in overflow-hidden' loading='lazy'/>
                <Moment fromNow className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'>
                    {listing.timestamp?.toDate()}
                </Moment>

                <div className='w-full p-[10px]'>
                    <div className='flex items-center space-x-1'>
                        <MdLocationOn className='text-lg text-green-600'/>
                        <p className='mt-[1.5px] font-semibold text-sm text-gray-600 truncate '>{listing.address}</p>
                    </div>
                    <p className='font-semibold truncate text-2xl my-[2px] text-[#457b9d]'>{listing.name}</p>
                    <p className='font-semibold text-[#457b9d] flex justify-between'>₹ {listing.discount ? listing.discountedPrice.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 
                        listing.regularPrice.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {listing.type === "rent"? " / Month" : ""}
                    </p>
                    <div className='flex items-center justify-start gap-4 mr-3 mt-[10px]'>
                        <div className='flex items-center'>
                            <p className='font-bold text-xs xl:text-sm'>{listing.bedrooms>1 ? `${listing.bedrooms} beds` : `1 bed`}</p>
                        </div>
                        <div className='flex items-center'>
                            <p className='font-bold text-xs xl:text-sm'>{listing.bathrooms>1 ? `${listing.bathrooms} baths` : `1 bath`}</p>
                        </div>
                        <div className='flex items-center'>
                            <p className='font-bold text-xs xl:text-sm'>{listing.kitchens>1 ? `${listing.kitchens} kitchens` : `1 kitchen`}</p>
                        </div>
                    </div>
                </div>
            </Link>

            {onDelete && (
                <FaTrash className='absolute bottom-2 right-2 text-red-500 cursor-pointer text-base' onClick={()=>onDelete(id)}/>
            )}
            {onEdit && (
                <MdEdit className='absolute bottom-2 right-8 text-green-500 cursor-pointer text-base rounded-full' onClick={()=>onEdit(id)}/>
            )}
        </li>
    )
}
