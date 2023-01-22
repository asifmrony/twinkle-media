import Header from "./partials/Header"
import Widgets from "./partials/Widgets"

const Profile = () => {
  return (
    <section className="profile">
      <Header />
      <div className="container">
        <div className="grid grid-cols-12 gap-x-4 mt-5">
          <div className="col-span-9">
            <div className="profile__about border-1 border-slate-200">
              <div className="max-h-[200px] overflow-hidden object-cover">
                <img src="https://picsum.photos/400/100" alt="Cover Photo" className='w-full object-contain rounded-tl-lg rounded-tr-lg' />
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