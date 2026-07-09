export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-3 gap-8">


          <div>

            <h2 className="text-2xl font-bold">
              MEBIDAI
            </h2>

            <p className="text-slate-400 mt-3">
              Build. Share. Learn.
            </p>

          </div>




          <div>

            <h3 className="font-semibold mb-3">
              Community
            </h3>


            <ul className="space-y-2 text-slate-400">

              <li>
                Blog
              </li>

              <li>
                Create Post
              </li>

              <li>
                Dashboard
              </li>

            </ul>


          </div>





          <div>

            <h3 className="font-semibold mb-3">
              About
            </h3>


            <p className="text-slate-400">
              A developer community platform
              for sharing knowledge and ideas.
            </p>


          </div>



        </div>





        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">

          © {new Date().getFullYear()} MEBIDAI Community.
          All rights reserved.

        </div>



      </div>


    </footer>
  );
}