import { Col, Image, Input, Modal, Row } from "antd";
import { Await, Form, useLoaderData } from "react-router-dom";
import { ITask } from "../../../redux/kanban/reducer";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import MenuActions from "./MenuActions";

const ModalAddTask = () => {
  const { data }: any = useLoaderData() as ITask;

  return (
    <Form method="post">
      <Modal
        title={
          <React.Suspense fallback={<p>loading...</p>}>
            <Await resolve={data} errorElement={<p>error...</p>}>
              {(data) => {
                return (
                  <Input
                    style={{
                      width: 400,
                    }}
                    defaultValue={data.name}
                  />
                );
              }}
            </Await>
          </React.Suspense>
        }
        open={true}
        width={700}
      >
        <React.Suspense fallback={<p>loading...</p>}>
          <Await resolve={data} errorElement={<p>error...</p>}>
            {(data) => (
              <>
                описание:
                <TextArea value={data.description} autoSize></TextArea>
                <Row>
                  <Col span={16}>
                    <div>вложения</div>
                    {data.attachment.map((item: any) => (
                      <Image src={item.url} width={50} />
                    ))}
                  </Col>
                  <Col span={8}>
                    <MenuActions />
                  </Col>
                </Row>
              </>
            )}
          </Await>
        </React.Suspense>
      </Modal>
    </Form>
  );
};
export default ModalAddTask;
