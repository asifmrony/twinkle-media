import { BiEditAlt } from "react-icons/bi"
import { Link, useParams } from "react-router-dom"
import Header from "./partials/Header"
import Widgets from "./partials/Widgets"
import Feed from "./partials/Feed"
import { usePostAuthor, useUpdateBio } from "../hooks/author"
import Spinner from "../utils/Spinner"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"

const Profile = () => {
  const [bioEdit, setBioEdit] = useState(false);
  const { id } = useParams();
  const { postAuthor, authorLoading } = usePostAuthor(id);
  const [authorBio, setAuthorBio] = useState(postAuthor?.bio);
  const { updateBio, bioUpdated } = useUpdateBio(id);
  console.log(postAuthor);

  const handleUpdateBio = () => {
    updateBio(authorBio);
    if(bioUpdated) {
      setBioEdit(false);
    }
  }

  if (authorLoading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <Spinner classList={'w-8 h-8'} />
    </div>
  )

  return (
    <section className="profile">
      <Header />
      <div className="container">
        <div className="grid grid-cols-12 gap-x-4 mt-5">
          <div className="col-span-9">
            <div className="profile__about bg-white border-2 border-slate-200 rounded-tl-lg rounded-tr-lg">
              <div className="profile__about-cover max-h-[200px] overflow-hidden object-cover">
                <img src="https://picsum.photos/400/100" alt="Cover Photo" className='w-full object-contain rounded-tl-lg rounded-tr-lg' />
              </div>
              <div className="profile__about-info px-4 pt-4 pb-2">
                <div className="flex justify-between">
                  <div className="w-36 h-36 rounded-full p-1 bg-white -mt-16">
                    <img className="h-full w-full rounded-full" src={postAuthor?.photoURL || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} alt="" />
                  </div>
                  <div className="flex-1 pl-3">
                    <h1 className="text-xl font-bold">{postAuthor?.displayName}</h1>
                    <p className="text-slate-600">Founder of Google Russia</p>
                  </div>
                  <div>
                    <button type="button" className="w-28 h-10 rounded-full text-white font-semibold bg-blue-600">Message</button>
                  </div>
                </div>
              </div>
              <div className="profile__bio px-6 py-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-slate-600">Bio</h2>
                  <button 
                    className="hover:bg-slate-300 rounded-full p-2"
                    onClick={() => setBioEdit(true)}
                  >
                      <BiEditAlt className="h-5 w-5 text-slate-600" />
                  </button>
                </div>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, corrupti quo nulla voluptas sint reiciendis! Minus maiores tempora deserunt nostrum?</p>
                <Transition appear show={bioEdit} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={() => setBioEdit(false)}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                              as="h3"
                              className="text-lg font-medium leading-6 text-gray-900"
                            >
                              Update your post
                            </Dialog.Title>
                            <div className="mt-2">
                              <textarea name="" id=""
                                rows="7"
                                value={authorBio}
                                onChange={(e) => setAuthorBio(e.target.value)}
                                className='text-sm text-gray-500 w-full p-2 border border-gray-200 rounded-md focus:outline-none'>
                              </textarea>
                            </div>

                            <div className="mt-4">
                              <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={handleUpdateBio}
                              >
                                Update
                              </button>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-4 mt-4 mb-20">
              <div className="col-span-4">
                <div className="bg-white rounded-md px-4 pb-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-600">Contact Info</h2>
                    <button className="hover:bg-slate-300 rounded-full p-1"><BiEditAlt className="h-5 w-5 text-slate-600" /></button>
                  </div>
                  <div className="py-2">
                    <p>Phone</p>
                    <input type="text" placeholder="01793726776" className="w-full" />
                  </div>
                  <div className="py-2">
                    <p>Email</p>
                    <input type="text" placeholder="asifmrony@gmail.com" className="w-full" />
                  </div>
                  <div className="py-2">
                    <p>Address</p>
                    <textarea
                      name="address"
                      id="address"
                      rows="2"
                      placeholder="House-18, Road-3, Block-D, Mirpur-12, Dhaka-1216"
                      className="w-full">
                    </textarea>

                  </div>
                </div>

              </div>
              <div className="col-span-8">
                <Feed />
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <Widgets />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile