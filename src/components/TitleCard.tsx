import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

export default function TitleCard(props: {
  title: string;
  subtitle: string;
}): JSX.Element {
  return (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonCardSubtitle style={{marginTop: 12}}>{props.subtitle}</IonCardSubtitle>
          <IonCardTitle>{props.title}</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </div>
  );
}
