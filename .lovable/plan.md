

# Lachimolala – Purple Wall Campo C

## Updated Plan

### Core Changes
- **Date**: October 7 (replaces all February 7 references)
- **Community name**: "Lachimolala"
- **Title**: "Lachimolala – Purple Wall Campo C"
- **Purpose**: Exclusive coordination and safety community for ARMYs attending Campo C on October 7
- **Visual inspiration**: ARIRANG era as primary mood/design reference
- **Language**: All visible text in Spanish
- **Aesthetic**: Premium dark purple, glassmorphism, galaxy/concert atmosphere

### Data Model Update

```text
Member {
  id, nickname, age, district, country,
  bias, biasWrecker, favoriteAlbum, favoriteSong, armySince,
  arrivalMode (sola/o | acompañada/o),
  arrivalTime,
  earlyQueueInterest (boolean),
  confirmsOctober7 (boolean),
  confirmsZonaCampoC (boolean),
  hasConfirmedTicket (boolean),
  acceptedSafetyRules (boolean),
  instagram, message, avatarUrl,
  proofImageUrl (optional placeholder, no upload yet),
  status: 'pending' | 'under_review' | 'approved' | 'rejected',
  createdAt
}
```

### Pages & Sections

**1. Landing Page**
- Hero: "Lachimolala – Purple Wall Campo C" with countdown to October 7
- Subtitle: coordination and safety community for Campo C ARMYs
- CTAs: "Quiero registrarme" / "Ver ARMYs registradas"
- Purpose intro emphasizing organization, safety, and solidarity
- ARIRANG-inspired mood section
- Live stats preview (approved members only)
- Footer

**2. Registration Form**
- All original fields (nickname, age, district, bias, album, song, etc.)
- New verification fields:
  - ¿Confirmas que asistirás el 07 de octubre?
  - ¿Tu zona es Campo C?
  - ¿Tienes entrada confirmada?
  - ¿Irás sola/o o acompañada/o?
  - ¿A qué hora planeas llegar?
  - ¿Te interesa hacer cola de madrugada?
  - ¿Aceptas las normas de seguridad y convivencia del grupo?
  - Optional proof image URL placeholder (disabled, labeled "próximamente")
- On submit: member saved with `status: 'pending'`
- Success state: "Tu registro está pendiente de verificación"
- No sensitive ticket data requested in visible UI

**3. Community Wall / Directory**
- **Only shows members with `status: 'approved'`**
- Collectible glassmorphism profile cards + list view toggle
- Search by name, filter by bias/district/arrival mode/early queue interest
- Sort by newest, alphabetical, district
- Empty states

**4. Stats Dashboard**
- Computed from approved members only
- Total ARMYs, top bias, top album, top district, solo vs accompanied, early queue count, common arrival time, latest approved member

**5. Normas y Seguridad (NEW)**
- Card-based section with rules:
  - No compartir datos sensibles
  - Cuidar entradas
  - Apoyarnos entre ARMYs
  - Mantener el respeto
  - Priorizar la seguridad del grupo

**6. Coordinación Previa al Concierto (NEW)**
- Replaces old "community support" section
- Cards/sections for:
  - Quiénes llegarán de madrugada
  - Quiénes van solas/os
  - Sugerencias de punto de encuentro
  - Recomendaciones útiles para Campo C

**7. Admin-Ready Foundation**
- Member status field in data model
- Service layer with `getApprovedMembers()`, `getPendingMembers()`, `updateMemberStatus()`
- UI only shows approved members publicly
- TODO comments for future admin review panel and Supabase connection

### Architecture
- React + TypeScript + Tailwind
- Mock data service layer (12+ sample approved profiles)
- Reusable components, utility functions for filtering/sorting/stats
- Mobile-first, sticky nav, floating CTA
- ARIRANG-inspired dark purple design system
- No chat, no auth, no real upload, no Supabase yet

