// components/PhotoThumb.tsx

interface Props {
  photo:     string
  photoType: 'emoji' | 'image'
  size?:     number
}

export default function PhotoThumb({ photo, photoType, size = 36 }: Props) {
  if (photoType === 'image') {
    return (
      <img
        src={photo}
        alt=""
        style={{
          width:       size,
          height:      size,
          borderRadius: 10,
          objectFit:   'cover',
          flexShrink:  0,
        }}
      />
    )
  }

  return (
    <div
      style={{
        width:           size,
        height:          size,
        background:      'rgba(255,255,255,0.05)',
        borderRadius:    10,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        fontSize:        size * 0.5,
        flexShrink:      0,
      }}
    >
      {photo}
    </div>
  )
}