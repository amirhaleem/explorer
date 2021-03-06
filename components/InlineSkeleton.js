import React from 'react'
import { Skeleton } from 'antd'

const InlineSkeleton = () => (
  <span className="inline-skeleton-override">
    <Skeleton active paragraph={{ rows: 0 }} size="small" />
  </span>
)

export default InlineSkeleton
