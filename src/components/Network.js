import { Link } from 'react-router-dom'
import { useAllUsers } from '../hooks/author'
import Spinner from '../utils/Spinner';
import Header from './partials/Header'

const Network = () => {
  const { allUsers, usersLoading, isError } = useAllUsers();
  console.log(allUsers);
  console.log(usersLoading);

  if (isError) return <div className="min-h-screen flex items-center justify-center">{isError}</div>;

  if (usersLoading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <Spinner classList={'w-8 h-8'} />
    </div>
  )

  return (
    <>
      <Header />
      <section className='container'>
        <div className='py-10'>
          <h1 className='text-slate-500 font-semibold'>All Active Users</h1>
          <div className="grid grid-cols-12 gap-x-3 mt-3">
            {allUsers?.map(({ id, displayName, designation, photoURL }) => (
              <div className="col-span-3 user-card bg-white rounded-lg border border-slate-200 p-2">
                <div className="flex space-x-2 items-center">
                  <div className='w-20 h-20 bg-white rounded-full p-[2px]'>
                    <Link to={`/profile/${id}`} className="post-insider-link">
                      <img src={photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                    </Link>
                  </div>
                  <div className='text-sm flex-1 text-neutral-700'>
                    <Link to={`/profile/${id}`} className="post-insider-link inline-block">
                      <h1 className='font-medium'>{displayName}</h1>
                    </Link >
                    <p className='font-light text-xs mb-1.5'>{designation}</p>
                    <button type="button" className="w-20 h-7 text-sm rounded-full text-white font-semibold bg-blue-600">Message</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Network