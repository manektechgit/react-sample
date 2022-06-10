import { useCallback, useEffect, useState } from 'react'

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Pagination from '../../components/Pagination'

export default function Events() {
  const [eventContent, setEventContent] = useState({})
  const [events, setEvents] = useState({})
  const { locale } = useRouter()
  const [page, setPage] = useState(1)
  const [paginations, setPaginations] = useState({
    page: page,
    totalRecoard: 0,
    limit: 10,
    totalPages: 0,
  })

  const fetchEventTransContent = async () => {
    const response = await axios({
      method: 'GET',
      url: '/event/translation',
    })
    setEventContent(response?.data)
  }

  const fetchEventContent = async () => {
    const response = await axios({
      method: 'GET',
      url: '/events',
    })
    setPaginations({
      page: page,
      totalRecoard: parseInt(response?.data?.pager?.total_items),
      limit: response?.data?.pager?.items_per_page,
      totalPages: response?.data?.pager?.total_pages,
    })
    const data = response?.data?.rows
    setEvents(data)
  }

  useEffect(() => {
    setPage(1)
    fetchEventTransContent()
  }, [locale])

  useEffect(() => {
    if (page > 0) {
      fetchEventContent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const paginate = useCallback(
    (page) => {
      setPage(page)
    },
    [setPage]
  )

  return (
    <>
      <section className="bg-cover bg-left min-h-[200px] md:h-[297px] flex items-center relative py-4 bg-[url('/images/event-banner.png')] bg-[#262626] before:absolute before:bg-[url('/images/banner-overly.png')] before:bg-no-repeat before:bg-cover before:left-0 before:top-0 before:h-full before:w-full before:mix-blend-multiply">
        <div className="container px-4 mx-auto relative">
          <h1 className="lyon text-white leading-normal">
            {eventContent?.page_title}
          </h1>
          <nav aria-label="Breadcrumb">
            <ol className="inline-flex flex-wrap items-center text-light-gray mt-4 text-body-md font-lyon-semibold">
              {eventContent?.breadcrumb?.length > 0 &&
                eventContent?.breadcrumb?.map((item, ind) => (
                  <>
                    <li
                      className={`${
                        ind > 0 ? "before:content-['/'] before:mx-2" : null
                      }`}
                    >
                      <Link href={item?.url}>
                        <a className="text-light-gray hover:text-greenscale-500">
                          {item?.label}
                        </a>
                      </Link>
                    </li>
                  </>
                ))}
            </ol>
          </nav>
        </div>
      </section>
      {events?.length > 0 && (
        <section className="bg-white">
          <div className="container px-4 mx-auto relative py-16">
            {events?.map((event) => (
              <>
                <div className="md:hidden rtl:md:ml-6 ltr:md:mr-6 shrink-0 bg-primary-black md:w-[100px] md:h-[100px] flex md:flex-col items-center md:justify-center justify-between text-center md:p-1 p-3 px-8 md:mb-0 mb-3 w-full">
                  <h5 className="lyon text-white mb-2">{event?.field_from}</h5>
                  <p className="text-white diodrum body-md mb-0">
                    {event?.field_from_1}
                  </p>
                </div>
                <div className="flex flex-wrap lg:flex-nowrap justify-between bg-grayscale-50 p-6 mb-6">
                  <div className="flex items-center flex-wrap md:flex-nowrap">
                    <div className="hidden rtl:md:ml-6 ltr:md:mr-6 shrink-0 bg-primary-black md:w-[100px] md:h-[100px] md:flex md:flex-col items-center md:justify-center justify-between text-center md:p-1 p-3 px-8 md:mb-0 mb-3 w-full">
                      <h5 className="lyon text-white mb-2">
                        {event?.field_from}
                      </h5>
                      <p className="text-white diodrum body-md">
                        {event?.field_from_1}
                      </p>
                    </div>
                    <div>
                      <h4 className="lyon text-black leading-normal">
                        {event?.title}
                      </h4>
                      <p className="body-md diodrum mt-2 text-blackscale-500">
                        {event?.field_event_place}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center lg:mt-0 mt-5">
                    <Link
                      href={`${locale === 'en' ? '/en' : ''}/events/${
                        event.nid
                      }`}
                    >
                      <a className="btn btn-black lg:px-8 min-h-[48px] flex-shrink-0 flex items-center">
                        {event?.nothing}
                        <span className="align-middle rtl:align-middle rtl:mr-3 ltr:ml-3 ltr:rotate-180">
                          <img
                            src="/images/arrow-left-white.svg"
                            width={19}
                            alt=""
                          />
                        </span>
                      </a>
                    </Link>
                  </div>
                </div>
              </>
            ))}
            {events?.length > 0 && (
              <Pagination paginate={paginate} paginations={paginations} />
            )}
          </div>
        </section>
      )}
    </>
  )
}
