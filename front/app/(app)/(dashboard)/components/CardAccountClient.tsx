'use client'

import dynamic from "next/dynamic"
import { CardAccountSkeleton } from "./CardAccountSkeleton"

const CardAccount = dynamic(() => import("./CardWithPieChart"), {
  ssr: false,
  loading: () => <CardAccountSkeleton />
})

export default CardAccount