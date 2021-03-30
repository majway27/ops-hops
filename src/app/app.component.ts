import { GraphConfig, GraphexpService } from '@savantly/ngx-graphexp';
import { Component } from '@angular/core';

@Component({
  selector: 'sv-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  graphConfig: GraphConfig = new GraphConfig();

  constructor (public service: GraphexpService) {
    /*this.graphConfig.nodeLabels = [
      'interrupt', 'activity'
    ];*/
    this.graphConfig.nodeLabels = [
      '[actor]-Customer', '[actor]-Case', '[actor]-Support', '[actor]-Bug',
      '[component]-Unit', '[component]-Constituient', '[component]-Userdata', 
      '[component]-Proxy', '[component]-Router','[component]-Messageprocesser','[component]-Keystore','[component]-Virtualhost',
      '[capability]-Feature', '[capability]-Function', '[capability]-Service', '[capability]-Report', '[capability]-Action', '[capability]-Agent',
      '[signal]-Instance', '[signal]-Output', '[signal]-Effect', '[signal]-Event',
      '[signal]-5xxResponseCode', '[signal]-Output', '[signal]-Effect', '[signal]-Event',
    ];
    this.graphConfig.linkLabels = [
      '[actor]-Belongs_to', '[actor]-Blocked_by',
      '[component]-Deployment_for', '[component]-Family_member_of', '[component]-Adjacency_to', '[component]-Convergence_to',
      '[capability]-Agency_of', '[capability]-Plays_with', '[capability]-Behavior_of',
      '[signal]-Mutation_of', '[signal]-Generated_for', '[signal]-Snapshot_of',
    ];
    /*this.graphConfig.linkLabels = [
      'aspect', 'interaction'
    ];*/
  }

}
