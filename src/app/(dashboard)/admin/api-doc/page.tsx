import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './api-doc';

export default async function IndexPage() {
  const spec = await getApiDocs();
  console.log('Spec:', spec);

  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  )
}