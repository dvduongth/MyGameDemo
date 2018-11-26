<GameFile>
  <PropertyGroup Name="GuiLoading" Type="Scene" ID="5e5888c9-b121-4205-a294-648c7e7ce835" Version="2.1.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Scene" Tag="23" ctype="GameNodeObjectData">
        <Size X="1242.0000" Y="2208.0000" />
        <Children>
          <AbstractNodeData Name="Panel_1" ActionTag="1605265686" Tag="24" IconVisible="False" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" HorizontalEdge="LeftEdge" VerticalEdge="BottomEdge" TouchEnable="True" ClipAble="False" ComboBoxIndex="2" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1242.0000" Y="2208.0000" />
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="0" G="128" B="0" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="Text_1" ActionTag="-660888064" Tag="25" IconVisible="False" HorizontalEdge="BothEdge" VerticalEdge="TopEdge" LeftMargin="497.6758" RightMargin="410.3242" TopMargin="617.1519" BottomMargin="1520.8481" FontSize="48" LabelText="GUI LOADING" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="334.0000" Y="70.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="664.6758" Y="1555.8481" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="165" B="0" />
            <PrePosition X="0.5352" Y="0.7046" />
            <PreSize X="0.0000" Y="0.0000" />
            <FontResource Type="Normal" Path="fonts/font_game_bold.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="ndLoadingProgress" ActionTag="2111017531" Tag="26" IconVisible="True" HorizontalEdge="BothEdge" VerticalEdge="BothEdge" LeftMargin="648.2754" RightMargin="593.7246" TopMargin="1260.1003" BottomMargin="947.8997" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="Panel_2_8_3" ActionTag="1351674311" Tag="27" IconVisible="False" LeftMargin="-100.0000" RightMargin="-100.0000" TopMargin="33.0000" BottomMargin="-47.0000" TouchEnable="True" ClipAble="False" ComboBoxIndex="2" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="200.0000" Y="14.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position Y="-40.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <SingleColor A="255" R="77" G="77" B="77" />
                <FirstColor A="255" R="26" G="26" B="26" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="lbLoadingPercent" ActionTag="1882010298" Tag="28" IconVisible="False" LeftMargin="-399.4342" RightMargin="-400.5658" TopMargin="-40.5316" BottomMargin="-6.4684" IsCustomSize="True" FontSize="32" LabelText="PERCENT: 100%" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="800.0000" Y="47.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="0.5658" Y="17.0316" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="0" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FontResource Type="Normal" Path="fonts/font_game_bold_italic.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="ldbPercent" ActionTag="1866622699" Tag="29" IconVisible="False" LeftMargin="-100.0000" RightMargin="-100.0000" TopMargin="33.0000" BottomMargin="-47.0000" ctype="LoadingBarObjectData">
                <Size X="200.0000" Y="14.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position Y="-40.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="0" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <ImageFileData Type="Default" Path="Default/LoadingBarFile.png" Plist="" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position X="648.2754" Y="947.8997" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5220" Y="0.4293" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>