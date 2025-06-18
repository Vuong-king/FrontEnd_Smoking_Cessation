
import PlanCard from './PlanCard'
import ColourfulText from '../../ui/ColourfulText'
import { Col, Row } from 'antd'

function PlanSection() {
  return (
     <section id="resources" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4"><ColourfulText text="Quit Plan" /></h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các tài liệu và công cụ giúp bạn hiểu rõ hơn về tài chính cá nhân
          </p>
        </div>
        <Row gutter={[32, 32]} className="flex-wrap justify-center mb-12">
          <Col xs={24} md={12} lg={8} className="flex">
            <PlanCard
              image="/images/quitplan/plan1.jpg"
              title="Lập Kế Hoạch Bỏ Thuốc"
              description="Bắt đầu hành trình bỏ thuốc lá với kế hoạch chi tiết và hướng dẫn từng bước."
              delay={0}
              className="h-full w-full"
            />
          </Col>
          <Col xs={24} md={12} lg={8} className="flex">
            <PlanCard
              image="/images/quitplan/plan2.jpg"
              title="Công Cụ Hỗ Trợ"
              description="Sử dụng các công cụ và ứng dụng hỗ trợ để theo dõi tiến trình bỏ thuốc."
              delay={1}
              className="h-full w-full"
            />
          </Col>
          <Col xs={24} md={12} lg={8} className="flex">
            <PlanCard
              image="/images/quitplan/plan3.jpg"
              title="Tư Vấn Chuyên Gia"
              description="Nhận tư vấn từ các chuyên gia về sức khỏe để có thêm động lực và hướng dẫn."
              delay={2}
              className="h-full w-full"
            />
          </Col>
        </Row>
        {/* <Row gutter={[32, 32]} className="flex-wrap justify-center">
          {resourcesData.map((resource, index) => (
            <Col xs={24} md={12} lg={8} key={index} className="flex">
              <PlanCard
                image={resource.image}
                title={resource.title}
                description={resource.description}
                delay={index}
                className="h-full w-full"
              />
            </Col>
          ))}
        </Row> */}
      </div>
    </section>
  )
}

export default PlanSection
