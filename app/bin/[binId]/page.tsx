import { BinInterface } from '@/components/bin/bin-interface'

interface BinPageProps {
  params: {
    binId: string
  }
}

export default function BinPage({ params }: BinPageProps) {
  return <BinInterface binId={params.binId} />
}
