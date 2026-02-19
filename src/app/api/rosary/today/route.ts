import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ROSARY_API_URL = 'https://the-rosary-api.vercel.app/v1/today';

// Translation map for mystery types
const MYSTERY_TRANSLATIONS: Record<string, string> = {
  'Joyful': 'Gozosos',
  'Sorrowful': 'Dolorosos',
  'Glorious': 'Gloriosos',
  'Luminous': 'Luminosos',
};

// Static list of mysteries (decades) in Spanish
const MYSTERY_LISTS: Record<string, string[]> = {
  'Joyful': [
    '1. La Encarnación del Hijo de Dios',
    '2. La Visitación de Nuestra Señora a su prima Santa Isabel',
    '3. El Nacimiento del Hijo de Dios en Belén',
    '4. La Presentación de Jesús en el Templo',
    '5. El Niño Jesús perdido y hallado en el Templo'
  ],
  'Sorrowful': [
    '1. La Oración de Jesús en el Huerto',
    '2. La Flagelación del Señor',
    '3. La Coronación de espinas',
    '4. Jesús con la Cruz a cuestas camino del Calvario',
    '5. La Crucifixión y Muerte de Nuestro Señor'
  ],
  'Glorious': [
    '1. La Resurrección del Señor',
    '2. La Ascensión del Señor a los Cielos',
    '3. La Venida del Espíritu Santo',
    '4. La Asunción de Nuestra Señora a los Cielos',
    '5. La Coronación de la Santísima Virgen'
  ],
  'Luminous': [
    '1. El Bautismo de Jesús en el Jordán',
    '2. La Autorrevelación de Jesús en las bodas de Caná',
    '3. El Anuncio del Reino de Dios invitando a la conversión',
    '4. La Transfiguración',
    '5. La Institución de la Eucaristía'
  ]
};

export async function GET() {
  try {
    const response = await fetch(ROSARY_API_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rosary data');
    }

    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : data;
    
    const mysteryTypeEn = item.mystery || '';
    const mysteryTypeEs = MYSTERY_TRANSLATIONS[mysteryTypeEn] || mysteryTypeEn;
    
    // Get the list of mysteries based on the type
    const mysteriesEs = MYSTERY_LISTS[mysteryTypeEn] || [];

    return NextResponse.json({
      mystery: mysteryTypeEs,
      mysteries: mysteriesEs,
      mp3Link: item.mp3Link,
      youtubeLink: item.youtubeLink
    });
  } catch (error) {
    console.error('Error fetching rosary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rosary data' },
      { status: 500 }
    );
  }
}
