import { BiEditAlt } from "react-icons/bi"
import { Link, useParams } from "react-router-dom"
import Header from "./partials/Header"
import Widgets from "./partials/Widgets"
import Feed from "./partials/Feed"
import { useAuthorPosts, usePostAuthor, useUpdateAuthor } from "../hooks/author"
import Spinner from "../utils/Spinner"
import { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { IoMdCloseCircleOutline, IoMdDoneAll } from "react-icons/io"
import { toast } from "react-toastify"
import CreatePost from "./partials/CreatePost"
import Post from "./partials/Post"
import { useDispatch, useSelector } from "react-redux"
import { login, selectUser } from "../features/userSlice"

const Profile = () => {
  const [bioEdit, setBioEdit] = useState(false);
  const [editHeadline, setEditHeadline] = useState(false);
  const { id } = useParams();
  const { postAuthor, authorLoading, errorObj } = usePostAuthor(id);
  const [authorInfo, setAuthorInfo] = useState({
    name: '',
    designation: '',
    bio: '',
    phone: '',
    email: '',
    address: ''
  });
  const { updateAuthor, authorUpdated } = useUpdateAuthor(id);
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const { allPosts, feedLoading, feedError } = useAuthorPosts(id);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (postAuthor?.bio) {
      setAuthorInfo({
        ...authorInfo,
        name: postAuthor?.displayName,
        designation: postAuthor?.designation,
        bio: postAuthor?.bio,
        phone: postAuthor?.phone,
        email: postAuthor?.email,
        address: postAuthor?.address
      });
    }
  }, [postAuthor])


  const handleUpdateBio = () => {
    updateAuthor({ bio: authorInfo.bio });
    if (authorUpdated) {
      toast.success('Bio Updated', { theme: "colored" });
      setBioEdit(false);
    }
  }

  const handleUpdateName = () => {
    updateAuthor({ phone: authorInfo.phone })
    if (authorUpdated) {
      toast.success('Phone Updated', { theme: "colored" });
      setEditName(false);
    }
  }

  const handleUpdateEmail = () => {
    updateAuthor({ email: authorInfo.email })
    if (authorUpdated) {
      toast.success('Phone Updated', { theme: "colored" });
      setEditEmail(false);
    }
  }

  const handleUpdateAddress = () => {
    updateAuthor({ address: authorInfo.address })
    if (authorUpdated) {
      toast.success('Address Updated', { theme: "colored" });
      setEditAddress(false);
    }
  }

  const handleUpdateHeadline = () => {
    updateAuthor({
      displayName: authorInfo.name,
      designation: authorInfo.designation
    });
    if(authorUpdated) {
      dispatch(login({
        
        displayName: authorInfo.name,
    }))
      toast.success("Headline info updated", { theme: 'colored' });
    } 
  }

  if (authorLoading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <Spinner classList={'w-8 h-8'} />
    </div>
  )

  if (errorObj) return <div className="min-h-screen flex items-center justify-center">{errorObj.message}</div>;

  return (
    <section className="profile">
      <Header />
      <div className="container">
        <div className="grid grid-cols-12 gap-x-4 mt-5">
          <div className="col-span-9">
            <div className="profile__about bg-white border-2 border-slate-200 rounded-lg">
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
                    {id === user.uid && <button
                      className="text-blue-600 text-sm hover:underline"
                      onClick={() => setEditHeadline(true)}
                    >
                      Edit headline
                    </button>}
                  </div>
                  <Transition appear show={editHeadline} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => setEditHeadline(false)}>
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
                                Update your Headline
                                <p className="font-light text-sm text-slate-600 mt-1">People will see this information in top of your profile</p>
                              </Dialog.Title>
                              <div className="mt-3 space-y-2">
                                <div className="space-y-1">
                                  <label htmlFor="name" className="text-slate-600 text-sm">Name</label>
                                  <input
                                    type="text"
                                    id="name"
                                    value={authorInfo.name}
                                    onChange={(e) => setAuthorInfo({ ...authorInfo, name: e.target.value})}
                                    className="text-sm text-gray-500 w-full p-2 border border-gray-200 rounded-md focus:outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label htmlFor="designation" className="text-slate-600 text-sm">Designation</label>
                                  <input
                                    type="text"
                                    id="designation"
                                    value={authorInfo.designation}
                                    onChange={(e) => setAuthorInfo({ ...authorInfo, designation: e.target.value})}
                                    className="text-sm text-gray-500 w-full p-2 border border-gray-200 rounded-md focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div className="mt-4 text-right">
                                <button
                                  type="button"
                                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  onClick={handleUpdateHeadline}
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
                  <div>
                    <button type="button" className="w-28 h-10 rounded-full text-white font-semibold bg-blue-600">Message</button>
                  </div>
                </div>
              </div>
              <div className="profile__bio px-6 py-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-slate-600">Bio</h2>
                  {id === user.uid && <button
                    className="hover:bg-slate-300 rounded-full p-2"
                    onClick={() => setBioEdit(true)}
                  >
                    <BiEditAlt className="h-5 w-5 text-slate-600" />
                  </button>}
                </div>
                <p>{authorInfo.bio}</p>
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
                                value={authorInfo.bio}
                                onChange={(e) => setAuthorInfo({ ...authorInfo, bio: e.target.value })}
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
                  </div>
                  <div className="py-2 relative">
                    <p>Phone</p>
                    <input
                      type="text"
                      value={authorInfo.phone}
                      className="w-full text-slate-400 p-1 rounded-md border border-slate-200 focus:outline-none disabled:cursor-not-allowed disabled:border-none disabled:bg-transparent"
                      onChange={(e) => setAuthorInfo({ ...authorInfo, phone: e.target.value })}
                      disabled={!editName} />
                    {id === user.uid && <div className="absolute right-2 top-2.5">
                      {editName ?
                        <div className="flex space-x-1">
                          <IoMdDoneAll className="h-5 w-5 cursor-pointer" onClick={handleUpdateName} />
                          <IoMdCloseCircleOutline className="h-5 w-5 cursor-pointer" onClick={() => setEditName(false)} />
                        </div> :
                        <BiEditAlt className="h-5 w-5 cursor-pointer text-slate-500" onClick={() => setEditName(true)} />
                      }</div>}
                  </div>
                  <div className="py-2 relative">
                    <p>Email</p>
                    <input
                      type="text"
                      className="w-full text-slate-400 p-1 rounded-md border border-slate-200 focus:outline-none disabled:cursor-not-allowed disabled:border-none disabled:bg-transparent"
                      value={authorInfo.email}
                      onChange={(e) => setAuthorInfo({ ...authorInfo, email: e.target.value })}
                      disabled={!editEmail}
                    />
                    {id === user.uid && <div className="absolute right-2 top-2.5">
                      {editEmail ?
                        <div className="flex space-x-1">
                          <IoMdDoneAll className="h-5 w-5 cursor-pointer" onClick={handleUpdateEmail} />
                          <IoMdCloseCircleOutline className="h-5 w-5 cursor-pointer" onClick={() => setEditEmail(false)} />
                        </div> :
                        <BiEditAlt className="h-5 w-5 cursor-pointer text-slate-500" onClick={() => setEditEmail(true)} />
                      }</div>}
                  </div>
                  <div className="py-2 relative">
                    <p>Address</p>
                    <textarea
                      name="address"
                      id="address"
                      rows="2"
                      value={authorInfo.address}
                      onChange={(e) => setAuthorInfo({ ...authorInfo, address: e.target.value })}
                      disabled={!editAddress}
                      className="w-full text-slate-400 p-1 rounded-md border border-slate-200 focus:outline-none disabled:cursor-not-allowed disabled:border-none disabled:bg-transparent">
                    </textarea>
                    {id === user.uid && <div className="absolute right-2 top-2.5">
                      {editAddress ?
                        <div className="flex space-x-1">
                          <IoMdDoneAll className="h-5 w-5 cursor-pointer" onClick={handleUpdateAddress} />
                          <IoMdCloseCircleOutline className="h-5 w-5 cursor-pointer" onClick={() => setEditAddress(false)} />
                        </div> :
                        <BiEditAlt className="h-5 w-5 cursor-pointer text-slate-500" onClick={() => setEditAddress(true)} />
                      }</div>}
                  </div>
                </div>

              </div>
              <div className="col-span-8">
                <div className="feed--profile space-y-2">
                  <CreatePost />

                  {feedLoading ? <section className='flex items-center justify-center'>
                    <Spinner classList={'w-6 h-6'} />
                  </section> : null}
                  {/* Post in Feed */}
                  {allPosts.map(({ likes, userId, id, message, date }) => (
                    <Post key={id} postId={id} />
                  ))}
                </div>
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